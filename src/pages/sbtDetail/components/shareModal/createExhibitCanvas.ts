import Taro from "@tarojs/taro";
import {
  relation_lover,
  relation_girlmate,
  relation_boymate,
  relation_family,
  relation_classmate,
  relation_colleague,
  soul_detail_tag_icon,
  soul_detail_certification_icon,
  soul_detail_share_exhibit_left_top_icon,
  soul_detail_share_exhibit_qrcode,
  soul_detail_share_exhibit_bottom_slogan,
  soul_detail_share_exhibit_bg_relation,
  soul_detail_share_exhibit_bg_tag,
  soul_detail_share_exhibit_bg_certification,
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
      var measureText = isLimitRow ? (connectShowText+'……') : connectShowText;
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
      shareImageUrl,
      relationTitle,
      description,
      username,
      activityType,
      relationType,
      cb = function() {}
    } = options;
    const w = 375;
    const h = activityType === 6 ? 750 : 700;
    let currentTop = 0; // 画布到顶部哪里了

    let fontColor = "rgba(255, 255, 255, 1)";
    let secondFontColor = "rgba(255, 255, 255, 0.65)";

    const leftTopImageRes = await Taro.downloadFile({
      url: soul_detail_share_exhibit_left_top_icon
    });

    let bgImage = '';
    if(activityType === 4) {
      bgImage = soul_detail_share_exhibit_bg_certification;
    } else if(activityType === 5) {
      bgImage = soul_detail_share_exhibit_bg_tag;
    } else if(activityType === 6) {
      bgImage = soul_detail_share_exhibit_bg_relation;
    }
    
    const bgImageRes = await Taro.downloadFile({
      url: bgImage
    })
    // const headImageRes = await Taro.downloadFile({
    //   url: headImage
    // });
    // const logoImgRes = await Taro.downloadFile({
    //   url: logo_icon
    // });
    // const addressTopImgRes = await Taro.downloadFile({
    //   url: soul_card_address_top_image
    // });

    let context = Taro.createCanvasContext(id);
    
    //背景
    this.fillRadiusRect(context,'#fff',0,0,w,h,12);
    context.drawImage(bgImageRes.tempFilePath, 0, 0, w, h);
    context.restore();
    // 左上角图片
    context.save();
    context.beginPath();
    context.arc(16 + 50 / 2, 16 + 50 / 2, 25, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    //context.stroke();
    context.drawImage(leftTopImageRes.tempFilePath, 16, 16, 50, 50);
    context.restore();

    // 左上角用户名
    context.save();
    context.font = "normal 700 18px/22px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='left';
    context.setTextBaseline('middle');
    context.fillText(username, 78, 30 + 22 / 2);

    currentTop += 30 + 22;

    // 左上角文字
    context.save();
    context.font = "normal 400 18px/26px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 0.85)');
    context.textAlign='left';
    context.setTextBaseline('middle');
    const leftTopTextHeight = this.textEllipsis(context, '邀请你快来一起围观这个灵魂凭证吧～', 16, currentTop + 22 + 26 / 2, 204, 26)
    currentTop += 22 + 52;

    // 中间大图标
    let middleIcon;
    const middleIconMarginTop = activityType === 6 ? 79 : 62;

    if(activityType === 6) {
      const imageList = [relation_lover, relation_girlmate, relation_boymate, relation_family, relation_classmate, relation_colleague];
      middleIcon = imageList[relationType];
    } else {
      middleIcon = activityType === 4 ? soul_detail_certification_icon : soul_detail_tag_icon
    }

    const middleIconRes = await Taro.downloadFile({
      url: middleIcon
    });
    context.save();
    context.beginPath();
    context.arc(115 + 150 / 2, currentTop + middleIconMarginTop + 150 / 2, 75, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    //context.stroke();
    context.drawImage(middleIconRes.tempFilePath, 115, currentTop + middleIconMarginTop, 150, 150);
    context.restore();

    currentTop += middleIconMarginTop + 150;

    // 主内容
    const mainText = activityType === 6 ? relationTitle : description;
    context.save();
    context.font = "normal 700 24px/36px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='center';
    context.setTextBaseline('middle');
    // context.fillText(mainText, w / 2, currentTop + 151 + 36 / 2);
    this.textEllipsis(context, mainText, w / 2, currentTop + 156 + 36 / 2, 351, 36, 1);


    currentTop += 151 + 36;

    // 关系附言
    if(activityType === 6) {
      context.save();
      context.font = "normal 400 20px/30px PingFangSC-Light,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='center';
      context.setTextBaseline('middle');
      this.textEllipsis(context, description, w / 2, currentTop + 5 + 30 / 2, 351, 30, 2);
      currentTop += 8 + 60;

    }

    // 二维码图片
    
    const qrcodeRes = await Taro.downloadFile({
      url: shareImageUrl
    });
    const qrcodeMarginTop = activityType === 6 ? 13 : 22;
    context.save();
    context.beginPath();
    context.arc(w / 2, currentTop + qrcodeMarginTop + 78 / 2, 78 / 2, 0, 2 * Math.PI);
    context.fillStyle ="#fff";
    context.fill();
    context.closePath();
    context.clip();
    context.restore();
    //context.stroke();
    context.save();
    context.drawImage(qrcodeRes.tempFilePath, w / 2 - 78 / 2, currentTop + qrcodeMarginTop, 78, 78);
    context.restore();

    currentTop += qrcodeMarginTop + 78;


    // 底部slogan
    const sloganRes = await Taro.downloadFile({
      url: soul_detail_share_exhibit_bottom_slogan
    });
    context.save();
    context.drawImage(sloganRes.tempFilePath, w / 2 - 156 / 2, currentTop + 17, 156, 29);
    context.restore();

    currentTop += 67 + 150;

    
    // Taro.hideLoading();
    context.draw(
      true,
      setTimeout(() => {
        Taro.canvasToTempFilePath({
          canvasId: id,
          success: (res) => {
            cb(res);
          },
          fail: (res) => {
            console.log(res);
          },
        });
      }, 500)
    );
  }
}