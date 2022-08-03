console.log('main2');
var cannyTimeOutId = -1;

function initAll() {
	console.log('initAll');
	alignCellPosition(1);
	alignCellPosition(2);
	alignCellPosition(3);
	alignCellPosition(4);
}

function onScrollList(columnNum) {
	cannyStart(function () {
		//console.log('onScrollList', columnNum);
		alignCellPosition(columnNum);
		//clickColumnCell(columnNum, itemOrder);
	}, 500);
	//console.log('cannyTimeOutId', cannyTimeOutId);
}

function cannyStart(action, delay) {
	clearTimeout(cannyTimeOutId);
	cannyTimeOutId = setTimeout(action, delay);
}

function selectItem(itm, itemNum, columnNum) {
	var imgElmnt = itm.children[0];
	var name = 'columnSelector' + columnNum;
	var elmnt = document.getElementById(name);
	var itemOrder = Math.round((imgElmnt.offsetTop - window.innerHeight * 0.5) / imgElmnt.offsetWidth);
	var yy = imgElmnt.offsetWidth * itemOrder + imgElmnt.offsetWidth * 0.5;
	yy = Math.round(yy);
	var oldItemOrder = Math.round((elmnt.scrollTop - imgElmnt.offsetWidth * 0.5) / imgElmnt.offsetWidth);
	elmnt.scrollTo({
		top: yy,
		behavior: 'smooth'
	});
	//console.log('selectItem', itemOrder,oldItemOrder);
	if(itemOrder==oldItemOrder){
		onSameColumnCell(columnNum, itemOrder);
	}else{
		onChangeColumnCell(columnNum, itemOrder);
	}
}

function alignCellPosition(columnNum) {
	//console.log('alignCellPosition', columnNum);
	var name = 'columnSelector' + columnNum;
	var elmnt = document.getElementById(name);
	var itemOrder = Math.round((elmnt.scrollTop - elmnt.offsetWidth * 0.5) / elmnt.offsetWidth);
	var yy = elmnt.offsetWidth * itemOrder + elmnt.offsetWidth * 0.5;
	if (yy <= Math.round(elmnt.offsetWidth * 0.5)) {
		yy = Math.round(elmnt.offsetWidth * 0.5);
	}
	if (yy >= Math.round(elmnt.scrollHeight - window.innerHeight - elmnt.offsetWidth * 0.5)) {
		yy = Math.round(elmnt.scrollHeight - window.innerHeight - elmnt.offsetWidth * 0.5);
	}
	yy = Math.round(yy);
	if (elmnt.scrollTop == yy) {
		//
	} else {
		elmnt.scrollTo({
			top: yy,
			behavior: 'smooth'
		});
		itemOrder = Math.round((yy - elmnt.offsetWidth * 0.5) / elmnt.offsetWidth);
		onChangeColumnCell(columnNum, itemOrder);
	}
}

function onChangeColumnCell(columnNum, itemNum) {
	console.log('onChangeColumnCell', columnNum, itemNum);
}
function onSameColumnCell(columnNum, itemNum) {
	console.log('onSameColumnCell', columnNum, itemNum);
}