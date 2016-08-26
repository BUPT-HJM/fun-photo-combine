/**
 * @author BUPT-HJM
 * @name  BoomGo 1.0.0
 * @description 一个有趣的QQ图片合成器（缩略图与大图不同）
 * @updateTime 2016/08/26
 */

var canvas_img = document.getElementById('canvas');
var canvas_bg = document.getElementById("canvas-bg");
var bgRadio = document.querySelectorAll("input[name='bgColor']");
var saveBtn = document.getElementById("saveBtn");
var createBtn = document.getElementById("createBtn");
var combineBtn = document.getElementById("combineBtn");
var imgBox = document.getElementById("imgBox");


var w = document.getElementById("white");
var b = document.getElementById("black");
var t = document.getElementById("transparent");

var whiteUrl;
var blackUrl;
var whiteReady = false;
var blackReady = false;

var data;
var img_max_height = 300; //设置图片最大高度



//白底显示图片
function imgWhite(img) {
	img.onload = function() {
		data = drawImg(img, canvas_img);
		whiteUrl = draw(processing(canvas_img), canvas_img);
		whiteReady = true;
	}
}

//黑底显示图片
function imgBlack(img) {
	img.onload = function() {
		data = drawImg(img, canvas_img);
		blackUrl = draw(processingBlack(canvas_img), canvas_img);
		blackReady = true;
	}
}


//绘制图片通用方法
function drawImg(img, canvas) {
	var ctx = canvas.getContext("2d");
	console.log(img.width)
	console.log(img.height)
	if (img.height > img_max_height) {
		// 宽度等比例缩放 *=  
		img.width *= img_max_height / img.height;
		img.height = img_max_height;
	}
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var data = ctx.getImageData(0, 0, img.width, img.height).data;
	return data;
}


//用imgData绘制
function draw(imgData, canvas) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(imgData, 0, 0);
	var imgUrl = canvas_img.toDataURL("image/png");
	ctx.clearRect(0, 0, canvas_img.width, canvas_img.height);
	return imgUrl;
}

//白底呈现的图片处理
function processing(canvas) {
	var ctx = canvas.getContext("2d");
	var imgData = ctx.createImageData(canvas.width, canvas.height);
	var arr = imgData.data;

	for (var i = 0, len = data.length; i < len; i += 4) {
		var red = data[i],
			green = data[i + 1],
			blue = data[i + 2],
			alpha = data[i + 3],
			y = 0.299 * red + 0.587 * green + 0.114 * blue; //亮度
		var k = 130;
		arr[i] = y;
		arr[i + 1] = y;
		arr[i + 2] = y;
		arr[i + 3] = alpha * (k - y) / 255;
		if (y > k) {
			arr[i + 3] = 0;
		}
	}
	return imgData;

}

//黑底呈现的图片处理
function processingBlack(canvas) {
	var ctx = canvas.getContext("2d");
	var imgData = ctx.createImageData(canvas.width, canvas.height);
	var arr = imgData.data;

	for (var i = 0, len = data.length; i < len; i += 4) {
		var red = data[i],
			green = data[i + 1],
			blue = data[i + 2],
			alpha = data[i + 3],
			y = 0.299 * red + 0.587 * green + 0.114 * blue; //亮度
		y = y * 4.5;
		var k = 100;
		arr[i] = y;
		arr[i + 1] = y;
		arr[i + 2] = y;
		arr[i + 3] = alpha * y / 255 * 0.08;
		if (y < 150) {
			arr[i + 3] = 0;
		}
	}
	return imgData;

}


//背景图初始化
function bgInit(color, canvas) {
	canvas.width = canvas_img.width;
	canvas.height = canvas_img.height;
	drawBack(color, canvas);
}

//背景图绘制
function drawBack(color, canvas) {
	console.log(color);
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (color != "transparent") {
		ctx.fillStyle = color; //设置背景填充颜色
		ctx.fillRect(0, 0, canvas.width, canvas.height); //填充画布背景
	}

}
//背景色变化逻辑
function bgColorChange() {
	for (var i = 0; i < bgRadio.length; i++) {
		(function(i) {
			bgRadio[i].onchange = function() {
				if (bgRadio[i].checked) {
					bgInit(bgRadio[i].value, canvas_bg);
				}
			}
		})(i)
	}
}

for (var i = 0; i < bgRadio.length; i++) {
	(function(i) {
		bgRadio[i].onchange = function() {
			alert("请先完成合成再测试");
		}
	})(i)
}

//图片上传逻辑
var filechooser = document.getElementById('filechooser');
var filechooser_2 = document.getElementById('filechooser_2');

filechooser.onchange = function() {
	var files = this.files;
	var file = files[0];

	// 接受 jpeg, jpg, png 类型的图片
	if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
		alert("请选择图片");
	}
	var reader = new FileReader();
	reader.onload = function() {
		var result = this.result;
		var img = new Image();
		//img.setAttribute('crossOrigin', 'anonymous');
		img.src = result;
		imgWhite(img);
	};

	reader.readAsDataURL(file);
};


filechooser_2.onchange = function() {
	var files = this.files;
	var file = files[0];

	// 接受 jpeg, jpg, png 类型的图片
	if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
		alert("请选择图片");
	}
	var reader = new FileReader();
	reader.onload = function() {
		var result = this.result;
		var img = new Image();
		img.src = result;
		imgBlack(img);
	};

	reader.readAsDataURL(file);
};



//下载和生成键点击初始化
function btnInit() {
	saveBtn.onclick = function() {
		saveImg();
	}
	createBtn.onclick = function() {
		createImg();
	}
}

//下载图片
function saveImg() {
	var imgUrl = canvas_img.toDataURL("image/png").replace("image/png", "image/octet-stream");
	var a = document.createElement('a');
	a.download = "fun.png";
	a.href = canvas_img.toDataURL();
	a.click();
}

//生成图片
function createImg() {
	imgBox.innerHTML = "";
	var img = document.createElement("img");
	img.src = canvas_img.toDataURL("image/png");
	imgBox.appendChild(img);
}



//合成图片逻辑
function combineBtnInit() {
	combineBtn.onclick = function() {
		if (!whiteReady || !blackReady) {
			//alert("请先完成两个上传再合成并且不能重复合成");
			return;
		}
		var img_white = new Image();
		var img_black = new Image();
		img_white.src = whiteUrl;
		img_black.src = blackUrl;
		img_white.onload = function() {
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas_img.width, canvas_img.height);
			ctx.drawImage(img_white, 0, 0, canvas_img.width, canvas_img.height);
			img_black.onload = function() {
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img_black, 0, 0, canvas_img.width, canvas_img.height);
				bgColorChange();
				whiteReady = false;
				blackReady = false;
				btnInit();
			}
		}
	}
}

combineBtnInit();