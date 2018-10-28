var zcdid = queryString.zcdid;
var cfid = "";
var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));

var pageSize = 10;

var qszstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});

var zdzstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});

var shzstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});


var ywystore = Ext.create('Ext.data.Store', {
    fields: ['employId', 'employName'],
    data: [
    ]
});
var HPStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'yundan_goods_id' },
        { name: 'yundan_chaifen_id' },
        { name: 'yundan_goodsName' },
        { name: 'yundan_goodsPack' },
        { name: 'yundan_goodsAmount' },
        { name: 'yundan_goodsWeight' },
        { name: 'yundan_goodsVolume' },
        { name: 'status' },
        { name: 'addtime' },
        { name: 'adduser' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindHPList(nPage);
    }
});



var khstore = Ext.create('Ext.data.Store', {
    fields: ['clientId', 'people', 'tel', 'address'],
    data: [
    ]
});


var driverstore = Ext.create('Ext.data.Store', {
    fields: ['driverId', 'people', 'tel', 'carNum'],
    data: [
    ]
});

var XZKCStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_chaifen_id' },
       { name: 'isDache' },
       { name: 'isPeiSong' },
       { name: 'isZhuhuodaofu' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' }],
    data: [
    ]
});

var XZYPSStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_chaifen_id' },
       { name: 'isDache' },
       { name: 'isPeiSong' },
       { name: 'isZhuhuodaofu' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' }],
    data: [
    ]
});


var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_chaifen_id' },
       { name: 'isDache' },
       { name: 'isPeiSong' },
       { name: 'isZhuhuodaofu' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindYDData(nPage);
    }
});

var YPSYDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_chaifen_id' },
       { name: 'isDache' },
       { name: 'isPeiSong' },
       { name: 'isZhuhuodaofu' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindYPSYDData(nPage);
    }
});

function BindYPSYDData(nPage) {
    CS('CZCLZ.ZCDMag.GetYPSYD', function (retVal) {
        YPSYDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, zcdid);
}

function BindHPList(nPage, cfid) {
    CS('CZCLZ.ZCDMag.GetHPList', function (retVal) {
        HPStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cfid);
}

function ShowHPList(cfid) {
    cfid = cfid;
    BindHPList(1, cfid);
    var win = new HPList();
    win.show();
}


function BindYDData(nPage) {
    var qsz = Ext.getCmp("officeId").getValue();
    var zdz = Ext.getCmp("toOfficeId").getValue();
    var kssj = Ext.getCmp("cx_kssj").getValue();
    var jssj = Ext.getCmp("cx_jssj").getValue();
    var keyword = Ext.getCmp("cx_keyword").getValue();

    CS('CZCLZ.ZCDMag.GetKCYDList', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
        var arr = [];
        if (YDStore.data.length > 0) {
            for (var i = 0; i < YDStore.data.length; i++) {
                for (var j = 0; j < XZKCStore.data.length; j++) {
                    if (YDStore.data.items[i].data.yundan_chaifen_id == XZKCStore.data.items[i].data.yundan_chaifen_id) {
                        arr.push(YDStore.findRecord("yundan_chaifen_id", YDStore.data.items[i].data.yundan_chaifen_id));
                    }
                }
            }
            Ext.getCmp('kcgrid').getSelectionModel().select(arr);
        }
    }, CS.onError, nPage, pageSize, qsz, zdz, kssj, jssj, keyword);
}

function GetKH() {
    CS('CZCLZ.ZCDMag.GetKH', function (retVal) {
        khstore.loadData(retVal);
    }, CS.onError)

}

function GetBSC() {
    CS('CZCLZ.ZCDMag.GetZCDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp("officeId").setValue(retVal[0]["officeId"]);
        CS('CZCLZ.ZCDMag.GetZCDZDZ', function (retVal) {
            zdzstore.loadData(retVal);
            Ext.getCmp("toOfficeId").setValue(retVal[0]["officeId"]);

            BindYDData(1);
        }, CS.onError)
    }, CS.onError)
}

function GetZDR() {
    CS('CZCLZ.ZCDMag.GetZDR', function (retVal) {
        Ext.getCmp("zhidanRen").setValue(retVal);
    }, CS.onError)
}

function xghp(id) {
    var r = HPStore.findRecord("yundan_goods_id", id).data;
    var win = new addHPWin();
    win.show(null, function () {
        var form = Ext.getCmp('addHPform');
        form.form.setValues(r);
    });
}

function delhp(id) {
    if (HPStore.data.length > 0) {
        for (var i = 0; i < HPStore.data.length; i++) {
            if (HPStore.data.items[i].data.yundan_goods_id == id) {
                HPStore.remove(HPStore.data.items[i]);
            }
        }
    }
    Ext.getCmp("hpgrid").reconfigure(HPStore);
}

function getshz() {
    CS('CZCLZ.ZCDMag.GetZCDZDZ', function (retVal) {
        shzstore.loadData(retVal);

    }, CS.onError)
}

function printYD() {
    var titlehtml = '<DIV style="LINE-HEIGHT: 30px" class=size16 align=center><STRONG><font color="#0000FF">装车清单一览表</font></STRONG></DIV>';

    var html = '<TABLE border=1 cellSpacing=0 cellPadding=1 width="100%" style="border-collapse:collapse" bordercolor="#333333">';
    html += '<thead>';
    html += '<TR>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>序号</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>运单号</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>到站</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>发货人</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>收货人</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>收货人地址</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>货名</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>包装</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>数量</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>重量</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>体积</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>实际运费</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>运输方式</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>大车送</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>备注</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>是否装车</b></DIV></TD>';
    html += '</TR>';
    html += '</thead>';    if (XZKCStore.data.length > 0) {
        for (var i = 0; i < XZKCStore.data.length; i++) {

            html += '<TR>';
            html += '<TD >' + (i + 1) + '</TD>';
            html += '<TD >' + XZKCStore.data.items[i].data.yundan_chaifen_number + '</TD>';
            html += '<TD >' + XZKCStore.data.items[i].data.toOfficeName + '</TD>';
            html += '<TD >' + XZKCStore.data.items[i].data.fahuoPeople + '</TD>';
            html += '<TD >' + XZKCStore.data.items[i].data.shouhuoPeople + '</TD>';
            html += '<TD >' + XZKCStore.data.items[i].data.shouhuoAddress + '</TD>';
            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + XZKCStore.data.items[i].data.moneyYunfei + '</TD>';            var ysfs = "";            if (XZKCStore.data.items[i].data.songhuoType == 0) {
                ysfs = "自提";
            } else {
                ysfs = "送货";
            }            var dcs = "";            if (XZKCStore.data.items[i].data.isDache == 0) {
                dcs = "否";
            } else {
                dcs = "是";
            }            html += '<TD>' + ysfs + '</TD>';            html += '<TD>' + dcs + '</TD>';            html += '<TD>' + XZKCStore.data.items[i].data.memo + '</TD>';            var sfzc = "";            if (XZKCStore.data.items[i].data.isPeiSong == 0) {
                sfzc = "否";
            } else {
                sfzc = "是";
            }            html += '<TD>' + sfzc + '</TD>';            html += '</TR>';
        }
    }    if (XZYPSStore.data.length > 0) {
        for (var i = 0; i < XZYPSStore.data.length; i++) {

            html += '<TR>';
            html += '<TD >' + (i + 1) + '</TD>';
            html += '<TD >' + XZYPSStore.data.items[i].data.yundan_chaifen_number + '</TD>';
            html += '<TD >' + XZYPSStore.data.items[i].data.toOfficeName + '</TD>';
            html += '<TD >' + XZYPSStore.data.items[i].data.fahuoPeople + '</TD>';
            html += '<TD >' + XZYPSStore.data.items[i].data.shouhuoPeople + '</TD>';
            html += '<TD >' + XZYPSStore.data.items[i].data.shouhuoAddress + '</TD>';
            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + XZYPSStore.data.items[i].data.moneyYunfei + '</TD>';            var ysfs = "";            if (XZYPSStore.data.items[i].data.songhuoType == 0) {
                ysfs = "自提";
            } else {
                ysfs = "送货";
            }            var dcs = "";            if (XZYPSStore.data.items[i].data.isDache == 0) {
                dcs = "否";
            } else {
                dcs = "是";
            }            html += '<TD>' + ysfs + '</TD>';            html += '<TD>' + dcs + '</TD>';            html += '<TD>' + XZYPSStore.data.items[i].data.memo + '</TD>';            var sfzc = "";            if (XZYPSStore.data.items[i].data.isPeiSong == 0) {
                sfzc = "否";
            } else {
                sfzc = "是";
            }            html += '<TD>' + sfzc + '</TD>';            html += '</TR>';
        }
    }
    html += '</TABLE>';
    LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_分页打印综合表格");
    var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
    LODOP.ADD_PRINT_HTM(26, "5%", "90%", 109, strStyle + titlehtml);
    LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
    LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
    LODOP.ADD_PRINT_HTM(128, "5%", "90%", "90%", html);
    LODOP.SET_PRINT_STYLEA(0, "TableRowThickNess", 25);    LODOP.PREVIEW();    XZKCStore.removeAll();    XZYPSStore.removeAll();
}

function printZCD() {
    var style = '<style>table,th{border:none;height:18px} td{border: 1px solid #000;height:18px}</style>';
    var html = '<TABLE border=0 cellSpacing=0 cellPadding=0  width="100%" height="200" bordercolor="#000000" style="border-collapse:collapse">';
    html += '<caption><b><font face="黑体" size="4">物流运输协议</font></b></caption>'
    html += '<thead>';
    html += '<TR>';
    html += '<th colspan="6">';
    html += '<DIV align=left><b>车辆牌照:' + Ext.getCmp("carNum").getValue() + '</b></DIV></th>';
    html += '<th colspan="6">';
    html += '<DIV align=left><b>驾驶员:' + Ext.getCmp("driverId").getRawValue() + '</b></DIV></th>';
    html += '<th colspan="5">';
    html += '<DIV align=left><b>联系电话:' + Ext.getCmp("tel").getValue() + '</b></DIV></th>';
    html += '</TR>';
    html += '<TR>';
    html += '<th colspan="6">';
    html += '<DIV align=left><b>装车日期:' + new Date(Ext.getCmp("qiandanDate").getValue()).Format("yyyy-MM-dd") + '</b></DIV></th>';
    html += '<th colspan="6">';
    html += '<DIV align=left><b>合同号:' + Ext.getCmp("zhuangchedanNum").getValue() + '</b></DIV></th>';
    html += '<th colspan="5">';
    html += '<DIV align=left><b>发车时间:' + new Date(Ext.getCmp("jiaofuDate").getValue()).Format("yyyy-MM-dd hh:mm:ss") + '</b></DIV></th>';
    html += '</TR>';
    html += '<TR>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>序号</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>运单号</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>发件人</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>发件人电话</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>收件人</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>收件人电话</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>货名</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>包装</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>数量</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>重量</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>体积</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>收件人地址</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>到付</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>回单类型</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>运输方式</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>大车送</b></DIV></TD>';
    html += '<TD width="2%">';
    html += '<DIV align=center><b>备注</b></DIV></TD>';
    html += '</TR>';
    html += '</thead>';

    if (YPSYDStore.data.length > 0) {
        for (var i = 0; i < YPSYDStore.data.length; i++) {
            html += '<TR>';
            html += '<TD >' + (i + 1) + '</TD>';
            html += '<TD >' + YPSYDStore.data.items[i].data.yundan_chaifen_number + '</TD>';
            html += '<TD >' + YPSYDStore.data.items[i].data.fahuoPeople + '</TD>';
            html += '<TD >' + YPSYDStore.data.items[i].data.fahuoTel + '</TD>';
            html += '<TD >' + YPSYDStore.data.items[i].data.shouhuoPeople + '</TD>';
            html += '<TD >' + YPSYDStore.data.items[i].data.shouhuoTel + '</TD>';
            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD>' + '</TD>';            html += '<TD >' + YPSYDStore.data.items[i].data.shouhuoAddress + '</TD>';            html += '<TD>' + YPSYDStore.data.items[i].data.moneyDaofu + '</TD>';            var hdlx = "";            if (YPSYDStore.data.items[i].data.huidanType == 0) {
                hdlx = "回单";
            } else {
                hdlx = "收条";
            }            html += '<TD>' + hdlx + '</TD>';            var ysfs = "";            if (YPSYDStore.data.items[i].data.songhuoType == 0) {
                ysfs = "自提";
            } else {
                ysfs = "送货";
            }            html += '<TD>' + ysfs + '</TD>';            var dcs = "";            if (YPSYDStore.data.items[i].data.isDache == 0) {
                dcs = "否";
            } else {
                dcs = "是";
            }            html += '<TD>' + dcs + '</TD>';            html += '<TD>' + YPSYDStore.data.items[i].data.memo + '</TD>';            html += '</TR>';
        }
    }    html += '<tfoot>';
    html += '<tr>';
    html += '<th colspan="14">';
    html += '<DIV align=left><b>司机总运费为:' + Ext.getCmp("moneyTotal").getValue() + '现付：' + Ext.getCmp("moneyYufu").getValue()
        + '欠付：' + Ext.getCmp("moneyQianfu").getValue() + '主货到付：' + Ext.getCmp("moneyZhuhuoDaofu").getValue()
        + '点上付：' + Ext.getCmp("moneZCDaofu").getValue() + '押金：' + Ext.getCmp("moneyYajin").getValue() + '</b></DIV></th>';
    html += '<td colspan="2">';
    html += '<DIV align=left><b>总分流费：</b></DIV></td>';
    html += '<td>';
    html += '<DIV align=left><b></b></DIV></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<th colspan="7">';
    html += '<DIV align=left><b>承运人签字</b></DIV></th>';
    html += '<th colspan="7">';
    html += '<DIV align=left><b>托运人签字</b></DIV></th>';
    html += '<td colspan="2">';
    html += '<DIV align=left><b>总配送费：</b></DIV></td>';
    html += '<td>';
    html += '<DIV align=left><b></b></DIV></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<th colspan="7">';
    html += '<DIV align=left><b>点上签字</b></DIV></th>';
    html += '<th colspan="7">';
    html += '<DIV align=left><b>（如收到所有货物数量齐全，货物完好无损）</b></DIV></th>';
    html += '<td colspan="2">';
    html += '<DIV align=left><b>最后结余：</b></DIV></td>';
    html += '<td>';
    html += '<DIV align=left><b></b></DIV></td>';
    html += '</tr>';
    html += '<tr>';
    html += '<th colspan="9">';
    html += '<DIV align=left><b>' + Ext.getCmp("memo").getValue() + '</b></DIV></th>';
    html += '<th colspan="8">';
    html += '<DIV align=left><b>到达日期：  年  月  日</b></DIV></th>';
    html += '</tr>';
    html += '</tfoot>';
    html += '</TABLE>';

    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_无边线表格");
    LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
    LODOP.ADD_PRINT_TABLE("2%", "1%", "96%", "98%", style + html);
    LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 800, 600, "");    LODOP.PREVIEW();

}
//************************************弹出界面***************************************
Ext.define('HPList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 700,
    height: 300,
    layout: {
        type: 'fit'
    },
    title: '查看运单货品',
    id: 'HPListWin',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'fit'
                        },
                        autoScroll: true,
                        dockedItems: [
                        ],
                        items: [
                                    {
                                        xtype: 'gridpanel',
                                        id: 'HPListpanel',
                                        store: HPStore,
                                        columnLines: true,
                                        columns: [
                                            {
                                                xtype: 'rownumberer',
                                                //这里可以设置你的宽度
                                                width: 35,
                                                sortable: false,
                                                menuDisabled: true,
                                            },
                                            {
                                                dataIndex: 'yundan_goodsName',
                                                flex: 1,
                                                text: '货品',
                                                sortable: false,
                                                menuDisabled: true
                                            },
                                            {
                                                dataIndex: 'yundan_goodsPack',
                                                flex: 1,
                                                text: '包装',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsAmount',
                                                flex: 1,
                                                text: '件数',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsWeight',
                                                flex: 1,
                                                text: '重量',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsVolume',
                                                flex: 1,
                                                text: '体积',
                                                sortable: false,
                                                menuDisabled: true
                                            }
                                        ],
                                        dockedItems: [

                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: HPStore,
                            dock: 'bottom'
                        }
                                        ]

                                    },

                        ]
                    }

            ]
        });

        me.callParent(arguments);
    }
});

Ext.define('EditDCWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '修改（大车送）',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditDCform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        queryMode: 'local',
                        columnWidth: 0.33,
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '是否为大车送',
                        name: 'isDache',
                        id: 'isDache',
                        anchor: '100%',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['否', 0],
                                ['是', 1]
                            ]
                        }),
                        value: 0
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditDCform');
                            if (form.form.isValid()) {
                                var isdcs = Ext.getCmp("isDache").getValue();

                                var xzkclist = [];
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    xzkclist.push(XZKCStore.data.items[i].data);
                                }
                                var me = this;
                                CS('CZCLZ.ZCDMag.SaveDCS', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        XZKCStore.removeAll();
                                        BindYDData(1);
                                        me.up('window').close();
                                    }

                                }, CS.onError, isdcs, xzkclist);



                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});


Ext.define('EditZHDFWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '设置（主货到付）',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditZHDFform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        queryMode: 'local',
                        columnWidth: 0.33,
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '是否为主货到付',
                        name: 'isZhuhuodaofu',
                        id: 'isZhuhuodaofu',
                        anchor: '100%',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['否', 0],
                                ['是', 1]
                            ]
                        }),
                        value: 0
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditZHDFform');
                            if (form.form.isValid()) {
                                var isZhuhuodaofu = Ext.getCmp("isZhuhuodaofu").getValue();

                                var xzkclist = [];
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    if (isZhuhuodaofu == 1) {
                                        if (XZKCStore.data.items[i].data.isDache == 1) {
                                            xzkclist.push(XZKCStore.data.items[i].data);
                                        } else {
                                            Ext.Msg.alert('提示', XZKCStore.data.items[i].data.yundan_chaifen_number + "运单不为大车送！");
                                            return;
                                        }
                                    } else {
                                        xzkclist.push(XZKCStore.data.items[i].data);
                                    }
                                }
                                var me = this;
                                CS('CZCLZ.ZCDMag.SaveZHDF', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        XZKCStore.removeAll();
                                        BindYDData(1);
                                        me.up('window').close();
                                    }

                                }, CS.onError, isZhuhuodaofu, xzkclist);



                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

Ext.define('EditSHZWin', {
    extend: 'Ext.window.Window',

    height: 120,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '修改收货网点',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'EditSHZform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        displayField: 'officeName',
                        valueField: 'officeId',
                        queryMode: 'local',
                        margin: '5 10 5 10',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '更改收货网点',
                        name: 'shwd',
                        id: 'shwd',
                        anchor: '100%',
                        store: shzstore
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('EditSHZform');
                            if (form.form.isValid()) {
                                var shwd = Ext.getCmp("shwd").getValue();

                                var xzkclist = [];
                                for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                    xzkclist.push(XZKCStore.data.items[i].data);
                                }
                                var me = this;
                                CS('CZCLZ.ZCDMag.SaveSHWD', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                        XZKCStore.removeAll();
                                        BindYDData(1);
                                        me.up('window').close();
                                    }

                                }, CS.onError, shwd, xzkclist);



                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

//************************************弹出界面***************************************


Ext.onReady(function () {
    Ext.define('EditZCD', {
        extend: 'Ext.container.Viewport',
        layout: {
            type: 'fit'
        },
        initComponent: function () {
            var me = this;

            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'panel',
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        dockedItems: [
                           {
                               xtype: 'toolbar',
                               dock: 'top',
                               items: [
                                   {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: 'button',
                                               iconCls: 'save',
                                               text: '保存',
                                               handler: function () {
                                                   var form = Ext.getCmp('addform');
                                                   if (form.form.isValid()) {
                                                       var driverId = Ext.getCmp("driverId").getValue();
                                                       if (driverId === "") {
                                                           Ext.Msg.alert('提示', "驾驶员不能为空！");
                                                           return;
                                                       }

                                                       var toAdsPeople = Ext.getCmp("toAdsPeople").getValue();
                                                       if (toAdsPeople === "") {
                                                           Ext.Msg.alert('提示', "联系人不能为空！");
                                                           return;
                                                       }

                                                       var toAdsTel = Ext.getCmp("toAdsTel").getValue();
                                                       if (toAdsTel === "") {
                                                           Ext.Msg.alert('提示', "联系电话不能为空！");
                                                           return;
                                                       }

                                                       var xzkclist = [];
                                                       for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                           xzkclist.push(XZKCStore.data.items[i].data);
                                                       }

                                                       //取得表单中的内容
                                                       var values = form.form.getValues(false);
                                                       var me = this;

                                                       CS('CZCLZ.ZCDMag.SaveZCD', function (retVal) {
                                                           if (retVal) {
                                                               Ext.Msg.show({
                                                                   title: '提示',
                                                                   msg: '保存成功!',
                                                                   buttons: Ext.MessageBox.OK,
                                                                   icon: Ext.MessageBox.INFO,
                                                                   fn: function () {

                                                                       FrameStack.popFrame();
                                                                   }
                                                               });
                                                           }

                                                       }, CS.onError, zcdid, values, xzkclist);


                                                   }
                                               }
                                           }
                                       ]
                                   },
                                   {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                               {
                                                   xtype: "button",
                                                   text: "打印",
                                                   iconCls: "printer",
                                                   handler: function () {
                                                       if (zcdid) {
                                                           printZCD();
                                                       } else {
                                                           Ext.Msg.alert('提示', "请先保存该装车单！");
                                                           return;
                                                       }
                                                   }
                                               }
                                       ]
                                   }, {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: "button",
                                               text: "选中运单",
                                               iconCls: "add",
                                               arrowAlign: "right",
                                               menu: [
                                                   {
                                                       text: "修改(大车送)",
                                                       handler: function () {
                                                           if (XZKCStore.data.items.length) {
                                                               var win = new EditDCWin();
                                                               win.show();
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择库存运单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   {
                                                       text: "设置(主货到付)",
                                                       handler: function () {
                                                           if (XZKCStore.data.items.length) {
                                                               var win = new EditZHDFWin();
                                                               win.show();
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择库存运单！");
                                                               return;
                                                           }
                                                       }
                                                   },

                                                   {
                                                       text: "拆分运单", handler: function () {

                                                           if (XZKCStore.data.items.length) {
                                                               if (XZKCStore.data.items.length > 1) {
                                                                   Ext.Msg.alert('提示', "每次只能对一条运单进行拆分！");
                                                                   return;
                                                               } else {
                                                                   FrameStack.pushFrame({
                                                                       url: "CFYD.html?cfid=" + XZKCStore.data.items[0].data.yundan_chaifen_id,
                                                                       onClose: function () {
                                                                           BindYDData(1);
                                                                           XZKCStore.removeAll();
                                                                       }
                                                                   });
                                                               }
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择库存运单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   {
                                                       text: "修改收货网点",
                                                       handler: function () {
                                                           if (XZKCStore.data.items.length) {
                                                               getshz();
                                                               var win = new EditSHZWin();
                                                               win.show();
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择库存运单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   '-',
                                                   {
                                                       text: "加入装车单",
                                                       handler: function () {
                                                           if (zcdid) {
                                                               if (XZKCStore.data.items.length) {
                                                                   var xzkclist = [];
                                                                   for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                                       xzkclist.push(XZKCStore.data.items[i].data);
                                                                   }
                                                                   CS('CZCLZ.ZCDMag.AddZCD', function (retVal) {
                                                                       if (retVal) {
                                                                           Ext.Msg.show({
                                                                               title: '提示',
                                                                               msg: '保存成功!',
                                                                               buttons: Ext.MessageBox.OK,
                                                                               icon: Ext.MessageBox.INFO,
                                                                               fn: function () {
                                                                                   BindYDData(1);
                                                                                   BindYPSYDData(1);
                                                                                   XZKCStore.removeAll();
                                                                               }
                                                                           });
                                                                       }

                                                                   }, CS.onError, zcdid, xzkclist);
                                                               } else {
                                                                   Ext.Msg.alert('提示', "请选择库存运单！");
                                                                   return;
                                                               }
                                                           } else {
                                                               Ext.Msg.alert('提示', "请先保存该装车单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   {
                                                       text: "从装车单中删除",
                                                       handler: function () {
                                                           if (zcdid) {
                                                               if (XZYPSStore.data.items.length) {
                                                                   var xzypslist = [];
                                                                   for (var i = 0; i < XZYPSStore.data.items.length; i++) {
                                                                       xzypslist.push(XZYPSStore.data.items[i].data);
                                                                   }
                                                                   CS('CZCLZ.ZCDMag.DeleteZCD', function (retVal) {
                                                                       if (retVal) {
                                                                           Ext.Msg.show({
                                                                               title: '提示',
                                                                               msg: '保存成功!',
                                                                               buttons: Ext.MessageBox.OK,
                                                                               icon: Ext.MessageBox.INFO,
                                                                               fn: function () {
                                                                                   BindYDData(1);
                                                                                   BindYPSYDData(1);
                                                                                   XZYPSStore.removeAll();
                                                                               }
                                                                           });
                                                                       }

                                                                   }, CS.onError, zcdid, xzypslist);
                                                               } else {
                                                                   Ext.Msg.alert('提示', "请选择已配送运单！");
                                                                   return;
                                                               }
                                                           } else {
                                                               Ext.Msg.alert('提示', "请先保存该装车单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   '-',
                                                   {
                                                       text: "导出", handler: function () {
                                                           if (XZKCStore.data.items.length) {
                                                               var xzkcslist = [];
                                                               for (var i = 0; i < XZKCStore.data.items.length; i++) {
                                                                   xzkcslist.push(XZKCStore.data.items[i].data);
                                                               }
                                                               DownloadFile("CZCLZ.ZCDMag.GetKCYDToFile", "导出库存运单.xls", 1, xzkcslist);
                                                               XZKCStore.removeAll();
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择库存运单！");
                                                               return;
                                                           }
                                                       }
                                                   },
                                                   {
                                                       text: "打印",
                                                       handler: function () {
                                                           if (XZKCStore.data.items.length || XZYPSStore.data.items.length) {
                                                               printYD();
                                                           } else {
                                                               Ext.Msg.alert('提示', "请选择运单！");
                                                               return;
                                                           }
                                                       }
                                                   }
                                               ]
                                           }]
                                   }, {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                   {
                                       xtype: "button",
                                       text: "确认到站",
                                       iconCls: "enable",
                                       handler: function () {
                                           Ext.MessageBox.confirm("提示", "是否确认到站?", function (obj) {
                                               if (obj == "yes") {
                                                   CS('CZCLZ.ZCDMag.IsArrive', function (retVal) {
                                                       if (retVal) {
                                                           Ext.Msg.show({
                                                               title: '提示',
                                                               msg: '修改成功!',
                                                               buttons: Ext.MessageBox.OK,
                                                               icon: Ext.MessageBox.INFO
                                                           });
                                                       }
                                                   }, CS.onError, zcdid);
                                               }
                                               else {
                                                   return;
                                               }
                                           });
                                       }
                                   }]
                                   },
                                   {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: 'button',
                                               iconCls: 'close',
                                               text: '返回',
                                               handler: function () {
                                                   FrameStack.popFrame();
                                               }
                                           }
                                       ]
                                   }
                               ]
                           }
                        ],
                        items: [
                            {
                                xtype: 'form',
                                layout: {
                                    type: 'column'
                                },

                                id: 'addform',
                                width: '100%',
                                border: false,
                                padding: '10 10 0 10',
                                region: 'center',
                                items: [

                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: 'zhuangchedanNum',
                                                    id: 'zhuangchedanNum',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '装车单号',
                                                    allowBlank: false,
                                                    labelWidth: 70,
                                                    value: new Date().Format("yyyyMMddhhmmssS"),
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    allowBlank: false,
                                                    format: 'Y-m-d',
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '签单日期',
                                                    editable: false,
                                                    name: 'qiandanDate',
                                                    id: 'qiandanDate',
                                                    columnWidth: 0.25,
                                                    labelWidth: 70,
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    allowBlank: false,
                                                    format: 'Y-m-d',
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '交付日期',
                                                    editable: false,
                                                    name: 'jiaofuDate',
                                                    id: 'jiaofuDate',
                                                    columnWidth: 0.25,
                                                    labelWidth: 70,
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    id: 'driverId',
                                                    name: 'driverId',
                                                    allowBlank: false,
                                                    displayField: 'people',
                                                    valueField: 'driverId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    store: driverstore,
                                                    fieldLabel: '驾驶员',
                                                    labelWidth: 70,
                                                    listeners: {
                                                        'select': function (o) {
                                                            Ext.getCmp("tel").setValue(o.valueModels[0].data.tel);
                                                            Ext.getCmp("carNum").setValue(o.valueModels[0].data.carNum);
                                                        }
                                                    }
                                                }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '车辆牌照',
                                                    name: 'carNum',
                                                    id: 'carNum',
                                                    labelWidth: 70,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '司机电话',
                                                    name: 'tel',
                                                    id: 'tel',
                                                    labelWidth: 70,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                {
                                                    xtype: 'combobox',
                                                    allowBlank: false,
                                                    displayField: 'officeName',
                                                    valueField: 'officeId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    fieldLabel: '到达站',
                                                    name: 'toOfficeId',
                                                    id: 'toOfficeId',
                                                    labelWidth: 70,
                                                    store: zdzstore,
                                                    listeners: {
                                                        'select': function (o) {
                                                            BindYDData(1);
                                                        }
                                                    }
                                                },
                                                  {
                                                      xtype: 'textfield',
                                                      columnWidth: 0.25,
                                                      margin: '5 10 5 10',
                                                      fieldLabel: '联系人',
                                                      allowBlank: false,
                                                      name: 'toAdsPeople',
                                                      id: 'toAdsPeople',
                                                      labelWidth: 70
                                                  }

                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '联系电话',
                                                    allowBlank: false,
                                                    name: 'toAdsTel',
                                                    id: 'toAdsTel',
                                                    labelWidth: 70
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    allowBlank: false,
                                                    displayField: 'officeName',
                                                    valueField: 'officeId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    fieldLabel: '起始站',
                                                    name: 'officeId',
                                                    id: 'officeId',
                                                    labelWidth: 70,
                                                    store: qszstore
                                                }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.24,
                                                    margin: '5 2 5 10',
                                                    fieldLabel: '运费总额',
                                                    name: 'moneyTotal',
                                                    id: 'moneyTotal',
                                                    allowNegative: false,
                                                    minValue: 0,
                                                    labelWidth: 70,
                                                    value: 0,
                                                    allowblank: false

                                                },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },


                                               {
                                                   xtype: 'numberfield',
                                                   columnWidth: 0.24,
                                                   margin: '5 2 5 10',
                                                   fieldLabel: '预付运费',
                                                   name: 'moneyYufu',
                                                   id: 'moneyYufu',
                                                   allowNegative: false,
                                                   minValue: 0,
                                                   labelWidth: 70,
                                                   value: 0,
                                                   allowblank: false

                                               },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },

                                                 {
                                                     xtype: 'numberfield',
                                                     columnWidth: 0.24,
                                                     margin: '5 2 5 10',
                                                     fieldLabel: '尚欠运费',
                                                     name: 'moneyQianfu',
                                                     id: 'moneyQianfu',
                                                     allowNegative: false,
                                                     minValue: 0,
                                                     labelWidth: 70,
                                                     value: 0,
                                                     allowblank: false

                                                 },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                                  {
                                                      xtype: 'numberfield',
                                                      columnWidth: 0.24,
                                                      margin: '5 2 5 10',
                                                      fieldLabel: '点上到付',
                                                      allowNegative: false,
                                                      minValue: 0,
                                                      name: 'moneZCDaofu',
                                                      id: 'moneZCDaofu',
                                                      labelWidth: 70,
                                                      value: 0,
                                                      allowblank: false

                                                  },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.24,
                                                    margin: '5 2 5 10',
                                                    fieldLabel: '主货到付',
                                                    name: 'moneyZhuhuoDaofu',
                                                    id: 'moneyZhuhuoDaofu',
                                                    allowNegative: false,
                                                    minValue: 0,
                                                    labelWidth: 70,
                                                    value: 0,
                                                    allowblank: false,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                               {
                                                   xtype: 'numberfield',
                                                   columnWidth: 0.24,
                                                   margin: '5 2 5 10',
                                                   fieldLabel: '本单押金',
                                                   allowNegative: false,
                                                   minValue: 0,
                                                   name: 'moneyYajin',
                                                   id: 'moneyYajin',
                                                   labelWidth: 70

                                               },
                                               { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textarea',
                                                    margin: '5 30 5 10',
                                                    columnWidth: 1,
                                                    fieldLabel: '备注',
                                                    name: 'memo',
                                                    id: 'memo',
                                                    labelWidth: 70
                                                }

                                                     ]
                                                 }
                                ]

                            },



                     {
                         xtype: 'tabpanel',
                         padding: '10 10 10 10',
                         layout: {
                             type: 'fit'
                         },
                         flex: 1,
                         items: [
                    {
                        xtype: 'gridpanel',
                        id: 'kcgrid',
                        region: 'center',
                        border: true,
                        store: YDStore,
                        itemId: 'tab1',
                        title: '库存运单',
                        columnLines: true,
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            selType: 'rowmodel',
                            mode: 'SIMPLE',
                            listeners: {
                                deselect: function (model, record, index) {//取消选中时产生的事件
                                    if (XZKCStore.data.length > 0) {
                                        for (var i = 0; i < XZKCStore.data.length; i++) {
                                            if (XZKCStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                XZKCStore.remove(XZKCStore.data.items[i]);
                                            }
                                        }
                                    }
                                },
                                select: function (model, record, index) {//record被选中时产生的事件
                                    var n = 1;
                                    if (XZKCStore.data.length > 0) {
                                        for (var i = 0; i < XZKCStore.data.length; i++) {
                                            if (XZKCStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                n--;
                                            }
                                        }
                                    }
                                    if (n == 1) {
                                        XZKCStore.add(record.data);
                                    }
                                },
                            }
                        }),
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isDache',
                                text: "大车送",
                                width: 50,
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isZhuhuodaofu',
                                width: 65,
                                text: '主货到付',
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }

                            },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'yundanDate',
                                 width: 80,
                                 format: 'Y-m-d',
                                 text: '制单日期',
                                 menuDisabled: true,
                                 sortable: false

                             },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_chaifen_number',
                                width: 130,
                                text: '运单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                width: 65,
                                text: '装车单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'hxrq',
                                width: 65,
                                format: 'Y-m-d',
                                text: '核销时间',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                width: 80,
                                text: '办事处',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toOfficeName',
                                width: 80,
                                text: '收货网点',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAddress',
                                width: 80,
                                text: '到达站',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoPeople',
                                width: 90,
                                text: '发货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoTel',
                                width: 90,
                                text: '发货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoPeople',
                                width: 90,
                                text: '收货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoTel',
                                width: 90,
                                text: '收货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                             {
                                 xtype: 'gridcolumn',
                                 dataIndex: 'shouhuoAddress',
                                 width: 180,
                                 text: '收货地址',
                                 menuDisabled: true,
                                 sortable: false
                             },
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'songhuoType',
                                  width: 65,
                                  text: '送货方式',
                                  menuDisabled: true,
                                  sortable: false,
                                  renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                      var str = "";
                                      if (value == 0) {
                                          str = "自提";
                                      } else if (value == 1) {
                                          str = "送货";
                                      }
                                      return str;
                                  }

                              },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'moneyYunfei',
                                   width: 100,
                                   text: '运费',
                                   menuDisabled: true,
                                   sortable: false
                               },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'payType',
                                   width: 110,
                                   text: '结算方式',
                                   menuDisabled: true,
                                   sortable: false,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str = "";
                                       if (value == 11) {
                                           str = "现金";
                                       } else if (value == 1) {
                                           str = "欠付";
                                       } else if (value == 2) {
                                           str = "到付";
                                       } else if (value == 3) {
                                           str = "回单付";
                                       } else if (value == 4) {
                                           str = "现付+欠付";
                                       } else if (value == 5) {
                                           str = "现付+到付";
                                       } else if (value == 6) {
                                           str = "到付+欠付";
                                       } else if (value == 7) {
                                           str = "现付+回单付";
                                       } else if (value == 8) {
                                           str = "欠付+回单付";
                                       } else if (value == 9) {
                                           str = "到付+回单付";
                                       } else if (value == 10) {
                                           str = "现付+到付+欠付";
                                       }
                                       return str
                                   }
                               },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyXianfu',
                                    width: 100,
                                    text: '现付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaofu',
                                    width: 100,
                                    text: '到付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyQianfu',
                                    width: 100,
                                    text: '欠付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuidanfu',
                                    width: 100,
                                    text: '回单付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuikouXianFan',
                                    width: 100,
                                    text: '回扣',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'zhidanRen',
                                    width: 90,
                                    text: '制单人',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishou',
                                    width: 90,
                                    text: '代收',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishouShouxu',
                                    width: 90,
                                    text: '代收手续费',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'huidanType',
                                    width: 70,
                                    text: '回单/收条',
                                    menuDisabled: true,
                                    sortable: false,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var str = "";
                                        if (parseInt(value) == 0) {
                                            str = "回单";
                                        } else if (parseInt(value) == 1) {
                                            str = "收条";
                                        }
                                        return str;
                                    }

                                },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'cntHuidan',
                                     width: 65,
                                     text: '回单张数',
                                     menuDisabled: true,
                                     sortable: false
                                 },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'yundan_chaifen_id',
                                     sortable: false,
                                     menuDisabled: true,
                                     text: '操作',
                                     width: 100,
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         cfid = value;
                                         return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + cfid + "\")'>查看货品</a>";
                                     }
                                 }

                        ],
                        viewConfig: {

                        },
                        dockedItems: [
                            {
                                xtype: 'toolbar',
                                dock: 'top',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        id: 'cx_keyword',
                                        labelWidth: 60,
                                        fieldLabel: '关键字'
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'cx_kssj',
                                        fieldLabel: '开始时间',
                                        format: 'Y-m-d',
                                        width: 190,
                                        labelWidth: 60
                                    }, {
                                        xtype: 'datefield',
                                        id: 'cx_jssj',
                                        fieldLabel: '结束时间',
                                        format: 'Y-m-d',
                                        width: 190,
                                        labelWidth: 60
                                    },
                                     {
                                         xtype: 'buttongroup',
                                         title: '',
                                         items: [
                                             {
                                                 xtype: 'button',
                                                 iconCls: 'search',
                                                 text: '查询',
                                                 handler: function () {
                                                     BindYDData(1);
                                                 }
                                             }
                                         ]
                                     }
                                ]
                            },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: YDStore,
                            dock: 'bottom'
                        }
                        ]
                    }, {
                        xtype: 'gridpanel',
                        id: 'ypsgrid',
                        region: 'center',
                        border: true,
                        store: YPSYDStore,
                        itemId: 'tab2',
                        title: '已配送运单',
                        columnLines: true,
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            selType: 'rowmodel',
                            mode: 'SIMPLE',
                            listeners: {
                                deselect: function (model, record, index) {//取消选中时产生的事件
                                    if (XZYPSStore.data.length > 0) {
                                        for (var i = 0; i < XZYPSStore.data.length; i++) {
                                            if (XZYPSStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                XZYPSStore.remove(XZYPSStore.data.items[i]);
                                            }
                                        }
                                    }
                                },
                                select: function (model, record, index) {//record被选中时产生的事件
                                    var n = 1;
                                    if (XZYPSStore.data.length > 0) {
                                        for (var i = 0; i < XZYPSStore.data.length; i++) {
                                            if (XZYPSStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                                n--;
                                            }
                                        }
                                    }
                                    if (n == 1) {
                                        XZYPSStore.add(record.data);
                                    }
                                },
                            }
                        }),
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isDache',
                                text: "大车送",
                                width: 50,
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isZhuhuodaofu',
                                width: 65,
                                text: '主货到付',
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }

                            },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'yundanDate',
                                 width: 80,
                                 format: 'Y-m-d',
                                 text: '制单日期',
                                 menuDisabled: true,
                                 sortable: false

                             },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundan_chaifen_number',
                                width: 130,
                                text: '运单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                width: 130,
                                text: '装车单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'hxrq',
                                width: 65,
                                format: 'Y-m-d',
                                text: '核销时间',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                width: 80,
                                text: '办事处',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toOfficeName',
                                width: 80,
                                text: '收货网点',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAddress',
                                width: 80,
                                text: '到达站',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoPeople',
                                width: 90,
                                text: '发货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoTel',
                                width: 90,
                                text: '发货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoPeople',
                                width: 90,
                                text: '收货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoTel',
                                width: 90,
                                text: '收货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                             {
                                 xtype: 'gridcolumn',
                                 dataIndex: 'shouhuoAddress',
                                 width: 180,
                                 text: '收货地址',
                                 menuDisabled: true,
                                 sortable: false
                             },
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'songhuoType',
                                  width: 65,
                                  text: '送货方式',
                                  menuDisabled: true,
                                  sortable: false,
                                  renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                      var str = "";
                                      if (value == 0) {
                                          str = "自提";
                                      } else if (value == 1) {
                                          str = "送货";
                                      }
                                      return str;
                                  }

                              },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'moneyYunfei',
                                   width: 100,
                                   text: '运费',
                                   menuDisabled: true,
                                   sortable: false
                               },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'payType',
                                   width: 110,
                                   text: '结算方式',
                                   menuDisabled: true,
                                   sortable: false,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str = "";
                                       if (value == 11) {
                                           str = "现金";
                                       } else if (value == 1) {
                                           str = "欠付";
                                       } else if (value == 2) {
                                           str = "到付";
                                       } else if (value == 3) {
                                           str = "回单付";
                                       } else if (value == 4) {
                                           str = "现付+欠付";
                                       } else if (value == 5) {
                                           str = "现付+到付";
                                       } else if (value == 6) {
                                           str = "到付+欠付";
                                       } else if (value == 7) {
                                           str = "现付+回单付";
                                       } else if (value == 8) {
                                           str = "欠付+回单付";
                                       } else if (value == 9) {
                                           str = "到付+回单付";
                                       } else if (value == 10) {
                                           str = "现付+到付+欠付";
                                       }
                                       return str
                                   }
                               },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyXianfu',
                                    width: 100,
                                    text: '现付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaofu',
                                    width: 100,
                                    text: '到付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyQianfu',
                                    width: 100,
                                    text: '欠付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuidanfu',
                                    width: 100,
                                    text: '回单付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuikouXianFan',
                                    width: 100,
                                    text: '回扣',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'zhidanRen',
                                    width: 90,
                                    text: '制单人',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishou',
                                    width: 90,
                                    text: '代收',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishouShouxu',
                                    width: 90,
                                    text: '代收手续费',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'huidanType',
                                    width: 70,
                                    text: '回单/收条',
                                    menuDisabled: true,
                                    sortable: false,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var str = "";
                                        if (parseInt(value) == 0) {
                                            str = "回单";
                                        } else if (parseInt(value) == 1) {
                                            str = "收条";
                                        }
                                        return str;
                                    }

                                },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'cntHuidan',
                                     width: 65,
                                     text: '回单张数',
                                     menuDisabled: true,
                                     sortable: false
                                 },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'yundan_chaifen_id',
                                     sortable: false,
                                     menuDisabled: true,
                                     text: '操作',
                                     width: 100,
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         cfid = value;
                                         return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + cfid + "\")'>查看货品</a>";
                                     }
                                 }

                        ],
                        viewConfig: {

                        },
                        dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: YPSYDStore,
                            dock: 'bottom'
                        }
                        ]
                    }
                         ]
                     }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });
    new EditZCD();

    GetBSC();
    CS('CZCLZ.ZCDMag.GetDriver', function (retVal) {
        driverstore.loadData(retVal);

        if (zcdid) {

            CS('CZCLZ.ZCDMag.GetZCDByID', function (ret) {
                if (ret) {
                    var form = Ext.getCmp('addform');
                    form.form.setValues(ret[0]);
                }
            }, CS.onError, zcdid);

            BindYPSYDData(1);
        }
    }, CS.onError)


});

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

