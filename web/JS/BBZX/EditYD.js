//------------------------------------------------------------------------全局变量------------------------------------------------------------------------------
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

var ydid = queryString.ydid;
var pageSize = 10;
var fromofficeid = "";
var toofficeid = "";
var clientId = "";
var cftype = 0;
var zcfdid = '';//主拆分单ID
//------------------------------------------------------------------------数据源--------------------------------------------------------------------------------
var khstore = Ext.create('Ext.data.Store', {
    fields: ['clientId', 'people', 'tel', 'address'],
    data: [
    ]
});

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

var ywystore = Ext.create('Ext.data.Store', {
    fields: ['employId', 'employName'],
    data: [
    ]
});
var HPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_goods_id' },
    { name: 'yundan_chaifen_id' },
    { name: 'yundan_goodsName' },
    { name: 'yundan_goodsPack' },
    { name: 'yundan_goodsAmount' },
    { name: 'yundan_goodsWeight' },
    { name: 'yundan_goodsVolume' },
    { name: 'status' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'SP_ID' }
    ],
    data: [
    ]
});
//------------------------------------------------------------------------页面方法------------------------------------------------------------------------------
function GetYDQSZ() {
    InlineCS('CZCLZ.YDMag.GetYDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp("officeId").setValue(retVal[0]["officeId"]);

        if (retVal[0]["officeId"] != "") {
            CS('CZCLZ.YDMag.GetYWYByQSZ', function (retVal) {
                ywystore.add({ 'employId': '', 'employName': '业务员' });
                ywystore.loadData(retVal, true);
                Ext.getCmp("traderName").setValue('');
            }, CS.onError, retVal[0]["officeId"]);
        }
    }, CS.onError)
}

function GetYDZDZ() {
    InlineCS('CZCLZ.BscMag.GetOtherBsc', function (retVal) {
        zdzstore.loadData(retVal);
        Ext.getCmp("toOfficeId").setValue(retVal[0]["officeId"]);
    }, CS.onError)
}

function GetZDR() {
    InlineCS('CZCLZ.YDMag.GetZDR', function (retVal) {
        Ext.getCmp("zhidanRen").setValue(retVal);
    }, CS.onError)
}

function GetKH() {
    InlineCS('CZCLZ.YDMag.GetKH', function (retVal) {
        khstore.loadData(retVal);
    }, CS.onError)

}
//------------------------------------------------------------------------界    面------------------------------------------------------------------------------
Ext.define('EditYD', {
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
                                            text: '确认签收',
                                            handler: function () {
                                                if (privilege("报表中心_运单一览表_确认签收")) {
                                                    CS('CZCLZ.YDMag.Qrqs', function (retVal) {
                                                        Ext.Msg.show({
                                                            title: '提示',
                                                            msg: '签收成功!',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO,
                                                        });
                                                    }, CS.onError, ydid)
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
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
                                            name: 'yundanNum',
                                            id: 'yundanNum',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '运单号',
                                            labelWidth: 70,
                                            //value: new Date().Format("yyyyMMddhhmmssS"),
                                            readOnly: true,
                                            fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                        },
                                        {
                                            xtype: 'combobox',
                                            id: 'officeId',
                                            name: 'officeId',
                                            allowBlank: false,
                                            displayField: 'officeName',
                                            valueField: 'officeId',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            store: qszstore,
                                            fieldLabel: '起始站',
                                            labelWidth: 70,
                                            listeners: {
                                                'select': function () {
                                                    CS('CZCLZ.YDMag.GetYWYByQSZ', function (retVal) {
                                                        ywystore.loadData(retVal);
                                                        Ext.getCmp("traderName").setValue(retVal[0]["employId"]);
                                                    }, CS.onError, Ext.getCmp("officeId").value);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'datefield',
                                            allowBlank: false,
                                            format: 'Y-m-d',
                                            margin: '5 10 5 10',
                                            fieldLabel: '单据日期',
                                            editable: false,
                                            name: 'yundanDate',
                                            id: 'yundanDate',
                                            columnWidth: 0.33,
                                            labelWidth: 70,
                                            value: new Date()
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
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '手工编号',
                                            name: 'realNum',
                                            id: 'realNum',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'officeName',
                                            valueField: 'officeId',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '收货网点',
                                            name: 'toOfficeId',
                                            id: 'toOfficeId',
                                            labelWidth: 70,
                                            store: zdzstore
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '分货网点',
                                            name: 'fenhuoSite',
                                            id: 'fenhuoSite',
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
                                            allowBlank: false,
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '目的地',
                                            name: 'toAddress',
                                            id: 'toAddress',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '制单人',
                                            name: 'zhidanRen',
                                            id: 'zhidanRen',
                                            labelWidth: 70,
                                            readOnly: true,
                                            fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                                        },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'employName',
                                            valueField: 'employId',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '业务员',
                                            name: 'traderName',
                                            id: 'traderName',
                                            labelWidth: 70,
                                            store: ywystore
                                        },
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
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'people',
                                            valueField: 'clientId',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '发货人',
                                            name: 'fahuoPeople',
                                            id: 'fahuoPeople',
                                            labelWidth: 70,
                                            store: khstore,
                                            listeners: {
                                                'select': function (o) {
                                                    Ext.getCmp("fahuoTel").setValue(o.valueModels[0].data.tel);
                                                    Ext.getCmp("faAddress").setValue(o.valueModels[0].data.address);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '手机电话',
                                            name: 'fahuoTel',
                                            id: 'fahuoTel',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '地址',
                                            name: 'faAddress',
                                            id: 'faAddress',
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
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '收货人',
                                            name: 'shouhuoPeople',
                                            id: 'shouhuoPeople',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '手机电话',
                                            allowBlank: false,
                                            name: 'shouhuoTel',
                                            id: 'shouhuoTel',
                                            labelWidth: 70
                                        },
                                        {
                                            xtype: 'textfield',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            fieldLabel: '收货地址',
                                            name: 'shouhuoAddress',
                                            id: 'shouhuoAddress',
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
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'TXT',
                                            valueField: 'VAL',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '送货方式',
                                            name: 'songhuoType',
                                            id: 'songhuoType',
                                            labelWidth: 70,
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TXT', 'VAL'],
                                                data: [
                                                    ['送货方式', ""],
                                                    ['自提', 0],
                                                    ['送货', 1]
                                                ]
                                            }),
                                            value: ''
                                        },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 10 5 10',
                                            fieldLabel: '运费',
                                            name: 'moneyYunfei',
                                            id: 'moneyYunfei',
                                            labelWidth: 70,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            value: 0
                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'TXT',
                                            valueField: 'VAL',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '结算方式',
                                            name: 'payType',
                                            id: 'payType',
                                            labelWidth: 70,
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TXT', 'VAL'],
                                                data: [
                                                    ['结算方式', ""],
                                                    ['现金', "11"],
                                                    ['欠付', "1"],
                                                    ['到付', "2"],
                                                    ['回单付', "3"],
                                                    ['现付+欠付', "4"],
                                                    ['现付+到付', "5"],
                                                    ['到付+欠付', "6"],
                                                    ['现付+回单付', "7"],
                                                    ['欠付+回单付', "8"],
                                                    ['到付+回单付', "9"],
                                                    ['现付+到付+欠付', "10"]
                                                ]
                                            }),
                                            value: "",
                                            listeners: {
                                                'select': function (record) {
                                                    if (Ext.getCmp("payType").getValue() != "") {
                                                        var paytype = Ext.getCmp("payType").getValue();
                                                        if (paytype == 11) {
                                                            Ext.getCmp("moneyXianfu").enable();
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 1) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").enable();
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 2) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").enable();
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 3) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").enable();
                                                        } else if (paytype == 4) {
                                                            Ext.getCmp("moneyXianfu").enable();
                                                            Ext.getCmp("moneyQianfu").enable();
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 5) {
                                                            Ext.getCmp("moneyXianfu").enable();
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").enable();
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 6) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").enable();
                                                            Ext.getCmp("moneyDaofu").enable();
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else if (paytype == 7) {
                                                            Ext.getCmp("moneyXianfu").enable();
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").enable();
                                                        } else if (paytype == 8) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").enable();
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").enable();
                                                        } else if (paytype == 9) {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").enable();
                                                            Ext.getCmp("moneyHuidanfu").enable();
                                                        } else if (paytype == 10) {
                                                            Ext.getCmp("moneyXianfu").enable();
                                                            Ext.getCmp("moneyQianfu").enable();
                                                            Ext.getCmp("moneyDaofu").enable();
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        } else {
                                                            Ext.getCmp("moneyXianfu").disable();
                                                            Ext.getCmp("moneyXianfu").setValue(0);
                                                            Ext.getCmp("moneyQianfu").disable();
                                                            Ext.getCmp("moneyQianfu").setValue(0);
                                                            Ext.getCmp("moneyDaofu").disable();
                                                            Ext.getCmp("moneyDaofu").setValue(0);
                                                            Ext.getCmp("moneyHuidanfu").disable();
                                                            Ext.getCmp("moneyHuidanfu").setValue(0);
                                                            Ext.Msg.alert('提示', "结算方式不能为空！");
                                                            return;
                                                        }
                                                    } else {
                                                        Ext.getCmp("moneyXianfu").disable();
                                                        Ext.getCmp("moneyXianfu").setValue(0);
                                                        Ext.getCmp("moneyQianfu").disable();
                                                        Ext.getCmp("moneyQianfu").setValue(0);
                                                        Ext.getCmp("moneyDaofu").disable();
                                                        Ext.getCmp("moneyDaofu").setValue(0);
                                                        Ext.getCmp("moneyHuidanfu").disable();
                                                        Ext.getCmp("moneyHuidanfu").setValue(0);
                                                        Ext.Msg.alert('提示', "结算方式不能为空！");
                                                        return;
                                                    }
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
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '现付',
                                            name: 'moneyXianfu',
                                            id: 'moneyXianfu',
                                            allowNegative: false,
                                            minValue: 0,
                                            labelWidth: 70,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            value: 0,
                                            allowblank: false,
                                            disabled: true

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '到付',
                                            name: 'moneyDaofu',
                                            id: 'moneyDaofu',
                                            allowNegative: false,
                                            minValue: 0,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            value: 0,
                                            labelWidth: 70,
                                            allowblank: false,
                                            disabled: true

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '欠付',
                                            allowNegative: false,
                                            minValue: 0,
                                            name: 'moneyQianfu',
                                            id: 'moneyQianfu',
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            value: 0,
                                            labelWidth: 70,
                                            allowblank: false,
                                            disabled: true

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
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '回单付',
                                            name: 'moneyHuidanfu',
                                            id: 'moneyHuidanfu',
                                            allowNegative: false,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            value: 0,
                                            minValue: 0,
                                            labelWidth: 70,
                                            allowblank: false,
                                            disabled: true

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '回扣金额',
                                            allowNegative: false,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            minValue: 0,
                                            name: 'moneyHuikou',
                                            id: 'moneyHuikou',
                                            labelWidth: 70

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'combobox',
                                            displayField: 'TXT',
                                            valueField: 'VAL',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '回扣现付',
                                            id: 'isHuikouXF',
                                            name: 'isHuikouXF',
                                            labelWidth: 70,
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TXT', 'VAL'],
                                                data: [
                                                    ['回扣现付', ""],
                                                    ['是', '1'],
                                                    ['否', '0']
                                                ]
                                            }),
                                            value: ""
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
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '代收货款',
                                            allowNegative: false,
                                            minValue: 0,
                                            name: 'moneyDaishou',
                                            id: 'moneyDaishou',
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            labelWidth: 70

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'numberfield',
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '代收手续费',
                                            allowNegative: false,
                                            decimalPrecision: 2,
                                            hideTrigger: true,
                                            minValue: 0,
                                            name: 'moneyDaishouShouxu',
                                            id: 'moneyDaishouShouxu',
                                            labelWidth: 70

                                        },
                                        { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                        {
                                            xtype: 'combobox',
                                            allowBlank: false,
                                            displayField: 'TXT',
                                            valueField: 'VAL',
                                            queryMode: 'local',
                                            columnWidth: 0.33,
                                            margin: '5 10 5 10',
                                            editable: false,
                                            fieldLabel: '回单收条',
                                            name: 'huidanType',
                                            id: 'huidanType',
                                            labelWidth: 70,
                                            store: new Ext.data.ArrayStore({
                                                fields: ['TXT', 'VAL'],
                                                data: [
                                                    ['回单收条', ""],
                                                    ['回单', "0"],
                                                    ['收条', "1"]
                                                ]
                                            }),
                                            value: ""
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
                                            columnWidth: 0.32,
                                            margin: '5 2 5 10',
                                            fieldLabel: '回单数',
                                            allowDecimals: false,
                                            allowNegative: false,
                                            minValue: 1,
                                            decimalPrecision: 0,
                                            hideTrigger: true,
                                            name: 'cntHuidan',
                                            id: 'cntHuidan',
                                            labelWidth: 70,
                                            allowBlank: false,
                                        },
                                        { xtype: "displayfield", value: "张", margin: '5 10 5 0', columnWidth: 0.01, }

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
                            xtype: 'panel',
                            padding: '10 10 10 10',
                            layout: {
                                type: 'fit'
                            },
                            flex: 1,
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    id: 'hpgrid',
                                    region: 'center',
                                    border: true,
                                    store: HPStore,
                                    columnLines: true,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'SP_ID',
                                            flex: 1,
                                            text: "商品ID",
                                            menuDisabled: true,
                                            sortable: false,
                                            hidden: true
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_goodsName',
                                            flex: 1,
                                            text: "货品名称",
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_goodsPack',
                                            flex: 1,
                                            text: '包装',
                                            menuDisabled: true,
                                            sortable: false

                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_goodsAmount',
                                            flex: 1,
                                            text: '件数',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_goodsWeight',
                                            flex: 1,
                                            text: '重量',
                                            menuDisabled: true,
                                            sortable: false
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundan_goodsVolume',
                                            flex: 1,
                                            text: '体积',
                                            menuDisabled: true,
                                            sortable: false
                                        }
                                    ],
                                    viewConfig: {

                                    }
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

Ext.onReady(function () {
    new EditYD();
    GetYDQSZ();
    GetYDZDZ();
    GetZDR();
    GetKH();
    if (ydid) {
        CS('CZCLZ.YDMag.GetYDByID', function (retVal) {
            if (retVal) {
                var form = Ext.getCmp('addform');
                form.form.setValues(retVal.yddt[0]);
                fromofficeid = retVal.yddt[0].officeId;
                toofficeid = retVal.yddt[0].toOfficeId;
                clientId = retVal.yddt[0].clientId;

                if (retVal.yddt[0].moneyHuikouXianFan != null) {
                    Ext.getCmp("isHuikouXF").setValue("1");
                } else {
                    Ext.getCmp("isHuikouXF").setValue("0");
                }

                var paytype = retVal.yddt[0].payType;
                if (paytype == 11) {
                    Ext.getCmp("moneyXianfu").enable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 1) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").enable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 2) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").enable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 3) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").enable();
                } else if (paytype == 4) {
                    Ext.getCmp("moneyXianfu").enable();
                    Ext.getCmp("moneyQianfu").enable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 5) {
                    Ext.getCmp("moneyXianfu").enable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").enable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 6) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").enable();
                    Ext.getCmp("moneyDaofu").enable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else if (paytype == 7) {
                    Ext.getCmp("moneyXianfu").enable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyQianfu").setValue(0);
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyDaofu").setValue(0);
                    Ext.getCmp("moneyHuidanfu").enable();
                } else if (paytype == 8) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").enable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").enable();
                } else if (paytype == 9) {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").enable();
                    Ext.getCmp("moneyHuidanfu").enable();
                } else if (paytype == 10) {
                    Ext.getCmp("moneyXianfu").enable();
                    Ext.getCmp("moneyQianfu").enable();
                    Ext.getCmp("moneyDaofu").enable();
                    Ext.getCmp("moneyHuidanfu").disable();
                } else {
                    Ext.getCmp("moneyXianfu").disable();
                    Ext.getCmp("moneyQianfu").disable();
                    Ext.getCmp("moneyDaofu").disable();
                    Ext.getCmp("moneyHuidanfu").disable();
                }

                HPStore.loadData(retVal.hpdt);
                cftype = retVal.cftype;
                zcfdid = retVal.zcfid;
                LODOP = getLodop();
            }
        }, CS.onError, ydid);
    } else {
        CS('CZCLZ.YDMag.GetYundanNum', function (retVal) {
            Ext.getCmp('yundanNum').setValue(retVal);
        }, CS.onError);
    }
});
