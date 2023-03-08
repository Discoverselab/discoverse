import Taro from "@tarojs/taro";
import {
  soul_share_card_bg_relation,
  soul_share_card_bg_tag,
  soul_share_card_bg_certification,
  relation_lover,
  relation_girlmate,
  relation_boymate,
  relation_family,
  relation_classmate,
  relation_colleague,
  soul_detail_tag_icon,
  soul_detail_certification_icon,
} from '@/constants/soulImage'

export default {
  fillRadiusRect(ctx,fillStyle,x, y, w, h, r) {
    ctx.save();
    ctx.setFillStyle(fillStyle);
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.setLineWidth(0);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.clip();
    ctx.fill();
    ctx.restore();
  },
  textEllipsis (context, text, x, y, maxWidth, lineHeight, row) {
    // if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
    //   return;
    // }
    // var canvas = context.canvas;
  
    // if (typeof maxWidth == 'undefined') {
    //   maxWidth = canvas && canvas.width || 300;
    // }
  
    // if (typeof lineHeight == 'undefined') {
    //   // 有些情况取值结果是字符串，比如 normal。所以要判断一下
    //   var getLineHeight = window.getComputedStyle(canvas).lineHeight;
    //   var reg=/^[0-9]+.?[0-9]*$/;
    //   lineHeight = reg.test(getLineHeight)? getLineHeight:20;
    // }
  
    // 字符分隔为数组
    var arrText = text.split('');
    // 文字最终占据的高度，放置在文字下面的内容排版，可能会根据这个来确定位置
    var textHeight = 0;
    // 每行显示的文字
    var showText = '';
    // 控制行数
    var limitRow = row;
    var rowCount = 0;

    for (var n = 0; n < arrText.length; n++) {
      var singleText = arrText[n];
      var connectShowText = showText + singleText;
      // 没有传控制的行数，那就一直换行
      var isLimitRow = limitRow ? rowCount === (limitRow - 1) : false;
      var measureText = isLimitRow ? (connectShowText+'…') : connectShowText;
      var metrics = context.measureText(measureText);
      var textWidth = metrics.width;
  
      if (textWidth > maxWidth && n > 0 && rowCount !== limitRow) {
        var canvasShowText = isLimitRow ? measureText:showText;
        context.fillText(canvasShowText, x, y);
        showText = singleText;
        y += lineHeight;
        textHeight += lineHeight;
        rowCount++;
        if (isLimitRow) {
          break;
        }
      } else {
        showText = connectShowText;
      }
    }
    if (rowCount !== limitRow) {
      context.fillText(showText, x, y);
    }
  
    var textHeightValue = rowCount < limitRow || !limitRow ? (textHeight + lineHeight): textHeight;
    return textHeightValue;
  },
  async createCanvas(id, options = {}) {
    // Taro.showLoading({ title: "海报生成中", mask: true });
    const {
      titleFontSize = 30,
      titleHeight = 45,
      relationTitle,
      description,
      activityType,
      relationType,
      cb = function() {}
    } = options;
    const w = 241;
    const h = 193;
    let currentTop = 0; // 画布到顶部哪里了
    
    let fontColor = "rgba(255, 255, 255, 1)";
    let secondFontColor = "rgba(255, 255, 255, 0.65)";
//     if(isLight){
//       fontColor = "rgba(0, 0, 0, 0.85)";
//       secondFontColor = "rgba(0, 0, 0, 0.45)";
//     }
//     const { userInfo } = this.props;

    let bgImage = soul_share_card_bg_relation;
    if(activityType === 4) {
      bgImage = soul_share_card_bg_certification;
    } else if(activityType === 5) {
      bgImage = soul_share_card_bg_tag;
    }
    const bgImageRes = await Taro.downloadFile({
      url: bgImage
    });
    let iconImageRes;
    let relation_lover_res,
      // relation_boymate_res,
      // relation_girlmate_res,
      // relation_family_res,
      // relation_classmate_res,
      // relation_colleague_res,
      relation_res1,
      relation_res2,
      relation_res3,
      relation_res4,
      relation_active_res;

    if(activityType === 6) {
      const imageList = [relation_lover, relation_girlmate, relation_boymate, relation_family, relation_classmate, relation_colleague];
      const relation_active = imageList[relationType];
      imageList.splice(relationType, 1);
      relation_active_res = await Taro.downloadFile({
        url: relation_active
      });
      relation_res1 = await Taro.downloadFile({
        url: imageList[0]
      });
      relation_res2 = await Taro.downloadFile({
        url: imageList[1]
      });
      relation_res3 = await Taro.downloadFile({
        url: imageList[2]
      });
      relation_res4 = await Taro.downloadFile({
        url: imageList[3]
      });

    } else {
      iconImageRes = await Taro.downloadFile({
        url: activityType === 4 ? soul_detail_certification_icon : soul_detail_tag_icon
      });
    }
    let context = Taro.createCanvasContext(id);
    
    this.fillRadiusRect(context, '#fff',0,0,w,h,0);

    //背景
    context.drawImage(bgImageRes.tempFilePath, 0, 0, w, h);
    
    let topTitle = '数字关系';
    if(activityType === 4) {
      topTitle = '身份认证';
    } else if(activityType === 5) {
      topTitle = '灵魂标签';
    }
    // 标题
    context.font = `normal bold ${14}px/${14}px PingFangSC-Light,PingFang`;
    context.setFillStyle(fontColor);
    context.textAlign='center';
    context.setTextBaseline('top');
    context.fillText(topTitle, w / 2, 11);

    currentTop += 11 + 14;

    // 图片
    if(activityType === 4 || activityType === 5) {
      context.save();
      context.beginPath();
      context.arc(w / 2, currentTop + 13 + 95 / 2, 95 / 2, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(iconImageRes.tempFilePath, w / 2 - 95 / 2, currentTop + 13, 95, 95);
      context.restore();
      currentTop += 13 + 95;
    } else {
      // 左一
      context.save();
      context.beginPath();
      context.arc(27 + 30, currentTop + 13 + 95 / 2, 30, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(relation_res1.tempFilePath, 27, currentTop + 13 + (95 - 60) / 2, 60, 60);
      context.restore();

      // 左二
      context.save();
      context.beginPath();
      context.arc(51 + 30, currentTop + 13 + 95 / 2, 30, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(relation_res2.tempFilePath, 51, currentTop + 13 + (95 - 60) / 2, 60, 60);
      context.restore();

      // 右一
      context.save();
      context.beginPath();
      context.arc(160 + 30, currentTop + 13 + 95 / 2, 30, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(relation_res3.tempFilePath, 160, currentTop + 13 + (95 - 60) / 2, 60, 60);
      context.restore();

      // 右二
      context.save();
      context.beginPath();
      context.arc(138 + 30, currentTop + 13 + 95 / 2, 30, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(relation_res4.tempFilePath, 138, currentTop + 13 + (95 - 60) / 2, 60, 60);
      context.restore();

      // 中间
      context.save();
      context.beginPath();
      context.arc(w / 2, currentTop + 13 + 95 / 2, 95 / 2, 0, 2 * Math.PI);
      context.closePath();
      context.clip();
      //context.stroke();
      context.drawImage(relation_active_res.tempFilePath, w / 2 - 95 / 2, currentTop + 13, 95, 95);
      context.restore();

      currentTop += 13 + 95;
    }


    // 内容
    context.save();
    context.font = "normal 700 20px/37px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='center';
    context.setTextBaseline('middle');
    const mainText = activityType === 6 ? relationTitle : description;
    this.textEllipsis(context, mainText, w / 2, currentTop + 11 + 37 / 2, 190, 37, 1);
    
    // Taro.hideLoading();
    context.draw(
      true,
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          canvasId: id,
          success: (res) => {
            console.log('success in create canvas')
            cb(res);
          },
          fail: (res) => {
            console.log('error in create canvas', res);
          },
        });
      }, 500)
    );
  }
}