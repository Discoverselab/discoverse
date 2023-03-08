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
  soul_lover_share_card_bg,
  soul_lover_share_card_top_text,
  soul_lover_share_card_top_text_2,
  soul_lover_share_card_icon_bg,
  soul_user_lover_between_icon,
  soul_card_address_top_image,
  soul_lover_share_card_qrcode,
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
  getTextWidth(context, text, maxWidth) {
    const metrics = context.measureText(text);
    const initWidth = metrics.width;
    if(initWidth > maxWidth) {
      console.log('inwhile')
      let _width = initWidth;
      let _text = text;
      while (_width > maxWidth) {
        const newList = Array.from(_text);
        newList.pop();
        _text = newList.join('');
        // ……
        const metrics = context.measureText(_text + '...');
        _width = metrics.width;
      }
      return {
        width: _width,
        text: _text + '...',
      };
    } else {
      return {
        width: initWidth,
        text: text,
      };
    }
  },
  sameWidthNumber(context, text, x, y) {
    const textList = (text + '').split('');
    const oneNumberWidth = context.measureText('0').width;
    let _x = x;
    textList.forEach((t) => {
      context.textAlign='center';

      context.fillText(t, _x + oneNumberWidth / 2, y);
      _x += oneNumberWidth;
    })
  },
  getSameWidthNumberWidth(context, text) {
    const textList = (text + '').split('');
    const oneNumberWidth = context.measureText('0').width;
    return textList.length * oneNumberWidth;
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
      userName,
      activityType,
      emitTime,
      receivedList,
      headImage,
      tokenIdList,
      txHash,
      contractAddress,
      cb = function() {}
    } = options;
    const w = 300;
    const h = 644;
    let currentTop = 0; // 画布到顶部哪里了
    
    const bgImageRes = await Taro.downloadFile({
      url: soul_lover_share_card_bg
    })

    let context = Taro.createCanvasContext(id);
    
    //背景
    this.fillRadiusRect(context,'#fff',0,0,w,h,0);
    context.drawImage(bgImageRes.tempFilePath, 0, 0, w, h);
    context.restore();
    
    // 第一行文字图片
    const text1ImageRes = await Taro.downloadFile({
      url: soul_lover_share_card_top_text
    })
    context.drawImage(text1ImageRes.tempFilePath, (300 - 269.4) / 2, 43, 269.4, 29.2);
    context.restore();
    currentTop += 43 + 29.2;

    // 第二行文字图片
    // const text2ImageRes = await Taro.downloadFile({
    //   url: soul_lover_share_card_top_text_2
    // })
    // context.drawImage(text2ImageRes.tempFilePath, (300 - 246) / 2, currentTop + 10, 246, 31);
    // context.restore();
    currentTop += 10 + 31;


    // 中间大图标
    const middleIconBgRes = await Taro.downloadFile({
      url: soul_lover_share_card_icon_bg
    })
    const middleIconBgWidth = 148;
    const middleIconBgHeight = 148;

    const middleIconRes = await Taro.downloadFile({
      url: relation_lover
    })
    const middleIconWidth = 104.5;
    const middleIconHeight = 104.5;

    context.save();
    context.beginPath();
    context.arc(w / 2, currentTop + 10 + middleIconBgWidth / 2, middleIconBgWidth / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    context.drawImage(middleIconBgRes.tempFilePath, w / 2 - middleIconBgWidth / 2, currentTop + 10, middleIconBgWidth, middleIconBgHeight);
    context.restore();

    context.save();
    context.beginPath();
    context.arc(w / 2, currentTop + 30.5 + middleIconWidth / 2, middleIconWidth / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    //context.stroke();
    context.drawImage(middleIconRes.tempFilePath, w / 2 - middleIconWidth / 2, currentTop + 30.5, middleIconWidth, middleIconHeight);
    context.restore();

    currentTop += 10 + middleIconBgHeight;

    // 铸造时间
    const timeText = `铸造于${emitTime}`
    context.save();
    context.font = "normal 500 11px/11px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, .65)');
    context.textAlign='center';
    context.setTextBaseline('middle');
    this.textEllipsis(context, timeText, w / 2, currentTop + 19 + 11 / 2, 276, 11, 1);

    currentTop += 19 + 11;

    // 用户
    const betweenIconBgRes = await Taro.downloadFile({
      url: soul_user_lover_between_icon
    })
    const sendUserImageRes = await Taro.downloadFile({
      url: headImage
    })
    
    const receivedUserImageRes = await Taro.downloadFile({
      url: receivedList[0].headImage
    })

console.log('receivedUserImageRes', receivedUserImageRes)
    
    // 发送人名字
    context.save();
    context.font = "normal 600 15px/15px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='left';
    context.setTextBaseline('middle');
    const sendUserTextWidthObject = this.getTextWidth(context, userName, 96);
    const sendUserName = sendUserTextWidthObject.text;
    const sendUserNameWidth = sendUserTextWidthObject.width;
    // this.textEllipsis(context, sendUserName, w / 2 - 14 - sendUserNameWidth, currentTop + 24 + 26 / 2, 96, 15, 1);
    context.fillText(sendUserName, w / 2 - 14 - sendUserNameWidth, currentTop + 24 + 26 / 2);

    // 发送人头像
    context.save();
    context.beginPath();
    context.arc(w / 2 - 14 - sendUserNameWidth - 2 - 26 / 2, currentTop + 24 + 26 / 2, 26 / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    //context.stroke();
    context.drawImage(sendUserImageRes.tempFilePath, w / 2 - 14 - sendUserNameWidth - 2 - 26, currentTop + 24, 26, 26);
    context.restore();

    // 中间图标
    context.save();
    context.drawImage(betweenIconBgRes.tempFilePath, w / 2 - 21.5 / 2, currentTop + 24 + (26 - 17) / 2, 21.5, 17);
    context.restore();

    // 接收人名字
    context.save();
    context.font = "normal 600 15px/15px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='left';
    context.setTextBaseline('middle');
    const receivedUserTextWidthObject = this.getTextWidth(context, receivedList[0].wxName, 96);
    console.log('receivedUserTextWidthObject.text', receivedUserTextWidthObject.text)
    const receivedUserName = receivedUserTextWidthObject.text;
    const receivedUserNameWidth = receivedUserTextWidthObject.width;
    // this.textEllipsis(context, receivedUserName, w / 2 + 14 + 26 + 2, currentTop + 24 + 26 / 2, 96, 15, 1);
    context.fillText(receivedUserName, w / 2 + 14 + 26 + 3, currentTop + 24 + 26 / 2);
    
    // 接收人头像
    context.save();
    context.beginPath();
    context.arc(w / 2 + 14 + 26 / 2, currentTop + 24 + 26 / 2, 26 / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    context.drawImage(receivedUserImageRes.tempFilePath, w / 2 + 14, currentTop + 24, 26, 26);
    context.restore();
    currentTop += 24 + 26;
    if(tokenIdList.length > 0) {
      // 第几对领取
      const receivedNumber = parseInt(tokenIdList[1]) / 2;
      context.restore();
      context.font = "normal 900 32px/44px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      const numberWidth = this.getSameWidthNumberWidth(context, receivedNumber + '');
      console.log('numberWidthObject', numberWidth)
  
      context.restore();
      context.font = "normal 700 18px/27px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      const restPreTextWidthObject = this.getTextWidth(context, '我们是第', 200);
      const restAfterTextWidthObject = this.getTextWidth(context, '对在区块链上', 200);
  
      context.restore();
      context.font = "normal 700 18px/27px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='left';
      context.setTextBaseline('normal');
      context.fillText(restPreTextWidthObject.text, (w - restPreTextWidthObject.width - numberWidth - restAfterTextWidthObject.width) / 2, currentTop + 17 + 32 + (44 - 32) / 2);
  
      context.restore();
      context.font = "normal 900 32px/44px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='left';
      context.setTextBaseline('normal');
      this.sameWidthNumber(context, receivedNumber + '', (w - restPreTextWidthObject.width - numberWidth - restAfterTextWidthObject.width) / 2 + restPreTextWidthObject.width, currentTop + 17 + 32 + (44 - 32) / 2);
  
      context.restore();
      context.font = "normal 700 18px/27px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='left';
      context.setTextBaseline('normal');
      context.fillText(restAfterTextWidthObject.text, (w - restPreTextWidthObject.width - numberWidth - restAfterTextWidthObject.width) / 2 + restPreTextWidthObject.width + numberWidth, currentTop + 17 + 32 + (44 - 32) / 2);
      currentTop += 17 + 44;
  
      // 第二行文字
      context.save();
      context.font = "normal 700 18px/27px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='center';
      context.setTextBaseline('middle');
      context.fillText(`铸造爱情宣言的恋人`, w / 2, currentTop + 27 / 2);
      currentTop += 27;
    } else {
      context.save();
      context.font = "normal 700 18px/27px PingFangSC-heavy,PingFang";
      context.setFillStyle('rgba(255, 255, 255, 1)');
      context.textAlign='center';
      context.setTextBaseline('middle');
      this.textEllipsis(context, description || '让我们的关系在链上永恒存储', w / 2, currentTop + 17 + 27 / 2, 276, 27, 2)
      currentTop += 17 + 71;
    }


    // 链上地址顶部图片
    const addressTopImgRes = await Taro.downloadFile({
      url: soul_card_address_top_image
    });
    context.save();
    context.drawImage(addressTopImgRes.tempFilePath, (w - 237) / 2, currentTop + 24, 237, 12.5);
    context.restore();

    currentTop += 24 + 12.5;


    // 链上地址
    context.save();
    context.font = "normal 400 9px/9px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 0.8)');
    context.textAlign='center';
    context.setTextBaseline('top');
    const addressMessageHeight = this.textEllipsis(context, contractAddress || ' ', 150, currentTop + 6, 236, 9);
    currentTop += 6 + 18;

    // 二维码图片
    
    const qrcodeRes = await Taro.downloadFile({
      url: soul_lover_share_card_qrcode
    });
    const qrcodeMarginTop = 30;
    context.save();
    context.beginPath();
    context.arc(w / 2, currentTop + qrcodeMarginTop + 56 / 2, 56 / 2, 0, 2 * Math.PI);
    // context.fillStyle ="#fff";
    // context.fill();
    context.closePath();
    context.clip();
    context.restore();
    //context.stroke();
    context.save();
    context.drawImage(qrcodeRes.tempFilePath, w / 2 - 56 / 2, currentTop + qrcodeMarginTop, 56, 56);
    context.restore();

    currentTop += qrcodeMarginTop + 56;


    // 底部slogan文字
    context.save();
    context.font = "normal 700 10px/16px PingFangSC-Light,PingFang";
    context.setFillStyle('rgba(255, 255, 255, 1)');
    context.textAlign='center';
    context.setTextBaseline('middle');
    context.fillText(`基于灵魂图谱的开放社交网络`, w / 2, currentTop + 10 + 16 / 2);

    currentTop += 10 + 16;

    
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