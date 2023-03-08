import Taro from "@tarojs/taro";
import {
  relation_lover,
  logo_icon,
  soul_card_address_top_image,
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
    debugger
    // Taro.showLoading({ title: "海报生成中", mask: true });
    const {
      shareImageUrl,
      titleFontSize = 24,
      titleHeight = 45,
      cardIcon,
      relationTitle,
      description,
      username,
      headImage,
      emitTime,
      txHash,
      activityType,
      cb = function() {}
    } = options;
    const w = 300;
    const h = activityType === 6 ? 519 : 465;
    let currentTop = 0; // 画布到顶部哪里了

    // let relationTitle = 'To 我的恋人';
    // let description = '结婚十周年快乐！希望区块链能见证我们的爱情';
    // let username = '倒霉芥末';
    // let emitTime = '发行于  2022-05-30 20:30:30';
    // let txHash = '0xd19584ef1db2f1f1b9d90dd16359a3a187326f286314f5caa25b528a62a7fc75';
debugger
    
    let fontColor = "rgba(255, 255, 255, 1)";
    let secondFontColor = "rgba(255, 255, 255, 0.65)";
//     if(isLight){
//       fontColor = "rgba(0, 0, 0, 0.85)";
//       secondFontColor = "rgba(0, 0, 0, 0.45)";
//     }
//     const { userInfo } = this.props;

    // todo 左下角的分享二维码需要后端提供接口
    // const cardIconRes = await Taro.downloadFile({
    //   url: cardIcon
    // });
    // const headImageRes = await Taro.downloadFile({
    //   url: headImage
    // });
    // const logoImgRes = await Taro.downloadFile({
    //   url: logo_icon
    // });
    // const addressTopImgRes = await Taro.downloadFile({
    //   url: soul_card_address_top_image
    // });
    // const shareImageUrlRes = await Taro.downloadFile({
    //   url: shareImageUrl
    // });
    // const [cardIconRes, logoImgRes, addressTopImgRes,titleImgRes,nftShadowRes, qrCodeRes,overlayImgRes,qrCardImgRes,headImgRes] = await Promise.all([
        // Taro.downloadFile({
        //   url: relation_lover
        // }),
        // Taro.downloadFile({
        //   url: logo_icon,
        // }),
        // Taro.downloadFile({
        //   url: soul_card_address_top_image
        // }),
        // Taro.downloadFile({
        //   url: "https://images.discoverse.club/3.0/nft/nft_share_poster_title.png"
        // }),
        // Taro.downloadFile({
        //   url: "https://images.discoverse.club/3.0/nft/nft_share_poster_nft_shadow.png"
        // }),
        // Taro.downloadFile({
        //   url: qrCodeUrl
        // }),
        // Taro.downloadFile({
        //   url: 'https://images.discoverse.club/3.0/nft/nft_share_poster_bg_overlay.png'
        // }),
        // Taro.downloadFile({
        //   url: 'https://images.discoverse.club/3.0/nft/nft_share_qr_card.png'
        // }),
        // Taro.downloadFile({
        //   url: userInfo.avatarUrl
        // }),
    // ]);
    let context = Taro.createCanvasContext(id);
    
    //背景
    if(activityType === 4) {
      const linearGradient1 = context.createLinearGradient(0,0,w,h);
      linearGradient1.addColorStop(0.0509, '#FACB53');
      linearGradient1.addColorStop(0.5054, '#DB5332');
      linearGradient1.addColorStop(0.8642, '#F9B54F');
      this.fillRadiusRect(context,linearGradient1,0,0,w,h,16);
    }
    if(activityType === 5) {
      const linearGradient1 = context.createLinearGradient(0,0,w,h);
      linearGradient1.addColorStop(0.0509, '#4174D8');
      linearGradient1.addColorStop(0.5054, '#0D08F9');
      linearGradient1.addColorStop(0.8642, '#4E7FDD');
      this.fillRadiusRect(context,linearGradient1,0,0,w,h,16);
    }
    if(activityType === 'RELATION') {
      const linearGradient1 = context.createLinearGradient(0,0,w,h);
      linearGradient1.addColorStop(0.0509, '#BA41D8');
      linearGradient1.addColorStop(0.5054, '#5A08F9');
      linearGradient1.addColorStop(0.8642, '#DD4E7C');
      this.fillRadiusRect(context,linearGradient1,0,0,w,h,16);
    }
    
    // 顶部图片
    context.drawImage(cardIcon, 75, 25, 150, 150);
    currentTop += 25 + 150;
    // 标题
    if(activityType === 6) {
      context.font = `normal bold ${titleFontSize}px/${titleHeight}px PingFangSC-Light,PingFang`;
      context.setFillStyle(fontColor);
      context.textAlign='center';
      context.setTextBaseline('middle');
      context.fillText(relationTitle || ' ', 150, currentTop + 15 + titleHeight / 2, 300);
  
      currentTop += 15 + titleHeight;
    }

    // // 附言
    // context.save();
    // context.font = "normal 400 16px/24px PingFangSC-Light,PingFang";
    // context.setFillStyle('rgba(255, 255, 255, 0.65)');
    // context.textAlign='center';
    // context.setTextBaseline('middle');
    // const descriptionHeight = this.textEllipsis(context, description, 150, currentTop + 11 + 24 / 2, 286, 24, 2)
    // currentTop += 11 + 48;
    // // console.log('descriptionHeight', descriptionHeight)

    // //昵称
    // context.save();
    // context.font = "normal 400 12px/12px PingFangSC-Light,PingFang";
    // context.setFillStyle('rgba(255, 255, 255, 0.85)');
    // context.textAlign='left';
    // context.setTextBaseline('top');
    // const usernameWidth = context.measureText(username).width;
    // context.fillText(username, 150 - (usernameWidth + 20) / 2 + 20, currentTop + 21);
    // // context.stroke();

    // //头像
    // context.save();
    // context.beginPath();
    // context.arc(150 - (usernameWidth + 20) / 2 + 8, currentTop + 19 + 8, 8, 0, 2 * Math.PI);
    // context.closePath();
    // context.clip();
    // //context.stroke();
    // context.drawImage(headImageRes.tempFilePath, 150 - (usernameWidth + 20) / 2, currentTop + 19, 16, 16);
    // context.restore();

    // currentTop += 19 + 16;

    // // 时间
    // context.save();
    // context.font = "normal 400 10px/10px PingFangSC-Light,PingFang";
    // context.setFillStyle('rgba(255, 255, 255, 0.65)');
    // context.textAlign='center';
    // context.setTextBaseline('top');
    // context.fillText(emitTime, 150, currentTop + 7);

    // currentTop += 7 + 10;
    // // 链上地址顶部图片
    // context.save();
    // context.drawImage(addressTopImgRes.tempFilePath, 32, currentTop + 35, 237, 12.5);
    // context.restore();

    // currentTop += 35 + 12.5;

    // // 链上地址
    // context.save();
    // context.font = "normal 400 9px/9px PingFangSC-Light,PingFang";
    // context.setFillStyle('rgba(255, 255, 255, 0.5)');
    // context.textAlign='center';
    // context.setTextBaseline('top');
    // const addressMessageHeight = this.textEllipsis(context, txHash || ' ', 150, currentTop + 6, 236, 9);
    // currentTop += 6 + 18;

    // // 二维码
    // context.save();
    // context.drawImage(shareImageUrlRes.tempFilePath, 25, h - 20 - 60, 60, 60);
    // context.restore();
    // // 二维码中的头像
    // context.save();
    // context.beginPath();
    // context.arc(25 + 60 / 2, h - 20 - 60 / 2, 12, 0, 2 * Math.PI);
    // context.closePath();
    // context.clip();
    // context.drawImage(headImageRes.tempFilePath, 25 + 30 - 12, h - 20 - 60 / 2 - 12, 24, 24);
    // context.restore();

    // // 右下角logo
    // context.save();
    // context.drawImage(logoImgRes.tempFilePath, 217, currentTop + 19, 55, 48);
    // context.restore();

    // currentTop += 21 + 48;

    // // 右下角文字
    // context.save();
    // context.font = "normal 700 12px/12px PingFangSC-Light,PingFang";
    // context.setFillStyle('rgba(255, 255, 255, 0.9)');
    // context.textAlign='right';
    // context.setTextBaseline('top');
    // context.fillText('基于灵魂图谱的开放社交网络', 277, currentTop + 3);
    
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