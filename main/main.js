const datbase = require('../main/datbase.js');
module.exports = function printInventory(selectedItems) {
    let allItems = datbase.loadAllItems()
    let promotions = datbase.loadPromotions()
    let sel_Items = []
    let selectedMessage = []
    let totalPrice = 0
    let totalSave = 0
    let temp1 = '***<没钱赚商店>购物清单***\n'
    let temp2 = ''
    let temp3 = ''
    for(let ele of selectedItems){
        if(ele.includes('-')){
            for(var  i = 0;i<ele.split('-')[1];i++) {
                sel_Items.push(ele.split('-')[0])
            }
        }else{
            sel_Items.push(ele)
        }
    }
    sel_Items.map(item1=>{
        allItems.map(item2=>{
            let count = 1
            let discount = 0;//不优惠：0 ；优惠：1
            let discountPrice = 0;//优惠的价格
            let discountCount = 0;//优惠的个数
            if(item1 === item2.barcode ) {
                if ( !selectedMessage[item1]) {
                    //是否在优惠编号里
                    if(promotions[0].barcodes.indexOf(item2.barcode)>0){
                        discount=1;
                    }
                    selectedMessage[item1]={
                        barcode: item2.barcode,
                        name: item2.name,
                        count: count,
                        unit: item2.unit,
                        price: item2.price,
                        sumPrice:item2.price,//小计
                        discount:discount,//是否优惠 不优惠：0 ；优惠：1
                        discountPrice:discountPrice,//优惠的金额
                        discountCount:discountCount//优惠的数量
                    }
                } else {
                    selectedMessage[item1].count++;
                    selectedMessage[item1].sumPrice+=selectedMessage[item1].price;
                }
            }
        })
        if(selectedMessage[item1].discount === 1){
            selectedMessage[item1].discountCount = Math.floor(selectedMessage[item1].count/3);
            selectedMessage[item1].discountPrice = selectedMessage[item1].discountCount* selectedMessage[item1].price;
        }
    })
    for(let item in selectedMessage) {
        let subPrice = (selectedMessage[item].sumPrice - selectedMessage[item].discountPrice).toFixed(2)
        temp2 += '名称：' + selectedMessage[item].name + '，数量：' + selectedMessage[item].count + selectedMessage[item].unit + '，单价：' + selectedMessage[item].price.toFixed(2) + '(元)，小计：' + subPrice+ '(元)\n'
        totalPrice += subPrice*100
        if(selectedMessage[item].discount === 1){
            temp3 += '名称：' + selectedMessage[item].name + '，数量：'+selectedMessage[item].discountCount + selectedMessage[item].unit + '\n'
            totalSave += selectedMessage[item].discountPrice
        }
    }
    let output = temp1+temp2+'----------------------\n' + '挥泪赠送商品：\n'+temp3+'----------------------\n' + '总计：'+(totalPrice/100).toFixed(2) +'(元)\n' + '节省：'+totalSave.toFixed(2) +'(元)\n' + '**********************';
    console.log(output)
};