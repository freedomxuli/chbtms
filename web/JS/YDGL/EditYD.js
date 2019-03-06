var ydid = queryString.ydid;
var pageSize = 10;
var fromofficeid = "";
var toofficeid = "";
var clientId = "";
//var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));

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
    { name: 'adduser' }
    ],
    data: [
    ]
});

var dbfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'id' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'carNum' },
        { name: 'expenseDate' },
        { name: 'money' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindDBF(nPage);
    }
});

var shfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'id' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'compName' },
        { name: 'expenseDate' },
        { name: 'money' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindSHF(nPage);
    }
});

var zzfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'id' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'compName' },
        { name: 'expenseDate' },
        { name: 'money' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindZZF(nPage);
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

var zhongzhuanstore = Ext.create('Ext.data.Store', {
    fields: ['zhongzhuanId', 'compName', 'people', 'tel'],
    data: [
    ]
});

function GetZhongZhuan() {
    CS('CZCLZ.YDMag.GetZhongZhuan', function (retVal) {
        zhongzhuanstore.loadData(retVal);
    }, CS.onError)
}

function GetDriver() {
    CS('CZCLZ.YDMag.GetDriver', function (retVal) {
        driverstore.loadData(retVal);
    }, CS.onError)

}


function BindDBF(nPage) {
    CS('CZCLZ.YDMag.GetDBFList', function (retVal) {
        dbfstore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, ydid);
}

function BindSHF(nPage) {
    CS('CZCLZ.YDMag.GetSHFList', function (retVal) {
        shfstore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, ydid);
}

function BindZZF(nPage) {
    CS('CZCLZ.YDMag.GetZZFList', function (retVal) {
        zzfstore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, ydid);
}


function GetKH() {
    CS('CZCLZ.YDMag.GetKH', function (retVal) {
        khstore.loadData(retVal);
    }, CS.onError)

}


function GetYDQSZ() {
    CS('CZCLZ.YDMag.GetYDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp("officeId").setValue(retVal[0]["officeId"]);

        if (retVal[0]["officeId"] != "") {
            CS('CZCLZ.YDMag.GetYWYByQSZ', function (retVal) {
                ywystore.loadData(retVal);
                Ext.getCmp("traderName").setValue(retVal[0]["employId"]);
            }, CS.onError, retVal[0]["officeId"]);
        }
    }, CS.onError)
}


function GetYDZDZ() {
    CS('CZCLZ.YDMag.GetYDZDZ', function (retVal) {
        zdzstore.loadData(retVal);
        Ext.getCmp("toOfficeId").setValue(retVal[0]["officeId"]);
    }, CS.onError)
}

function GetZDR() {
    CS('CZCLZ.YDMag.GetZDR', function (retVal) {
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

function xgdbf(id) {
    CS('CZCLZ.YDMag.GetDriver', function (ret) {
        driverstore.loadData(ret);
        CS('CZCLZ.YDMag.GetDBFById', function (retVal) {
            if (retVal) {

                var win = new addDBFWin();
                win.show(null, function () {
                    var form = Ext.getCmp('addDBFform');
                    form.form.setValues(retVal[0]);
                });
            }
        }, CS.onError, id);
    }, CS.onError)
}

function xgshf(id) {
    CS('CZCLZ.YDMag.GetDriver', function (ret) {
        driverstore.loadData(ret);
        CS('CZCLZ.YDMag.GetDBFById', function (retVal) {
            if (retVal) {

                var win = new addSHFWin();
                win.show(null, function () {
                    var form = Ext.getCmp('addSHFform');
                    form.form.setValues(retVal[0]);
                    Ext.getCmp("shtel").setValue(retVal[0]["tel"]);
                    Ext.getCmp("shcarNum").setValue(retVal[0]["carNum"]);

                });
            }
        }, CS.onError, id);
    }, CS.onError)
}

function xgzzf(id) {
    CS('CZCLZ.YDMag.GetZhongZhuan', function (ret) {
        zhongzhuanstore.loadData(ret);
        CS('CZCLZ.YDMag.GetZZFById', function (retVal) {
            if (retVal) {

                var win = new addZZFWin();
                win.show(null, function () {
                    var form = Ext.getCmp('addZZFform');
                    form.form.setValues(retVal[0]);
                    Ext.getCmp("zzpeople").setValue(retVal[0]["people"]);
                    Ext.getCmp("zztel").setValue(retVal[0]["tel"]);

                });
            }
        }, CS.onError, id);
    }, CS.onError)
}

function deldbf(id) {
    Ext.MessageBox.confirm("提示", "是否删除?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.YDMag.DeleteDBFById', function (retVal) {
                if (retVal) {
                    BindDBF(1);
                    BindSHF(1);
                    BindZZF(1);
                }
            }, CS.onError, id);
        }
        else {
            return;
        }
    });
}

//************************************弹出界面***************************************
Ext.define('addHPWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '货品编辑',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addHPform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'HPID',
                        id: 'yundan_goods_id',
                        name: 'yundan_goods_id',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '货品名称',
                        id: 'yundan_goodsName',
                        name: 'yundan_goodsName',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '包装',
                        id: 'yundan_goodsPack',
                        name: 'yundan_goodsPack',
                        labelWidth: 70,
                        anchor: '100%'
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: '件数',
                        id: 'yundan_goodsAmount',
                        name: 'yundan_goodsAmount',
                        allowDecimals: false,
                        allowNegative: false,
                        minValue: 1,
                        labelWidth: 70,
                        allowBlank: false,
                        anchor: '100%'
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '重量',
                                id: 'yundan_goodsWeight',
                                name: 'yundan_goodsWeight',
                                columnWidth: 0.99,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "吨", columnWidth: 0.01 },
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 0 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '体积',
                                id: 'yundan_goodsVolume',
                                name: 'yundan_goodsVolume',
                                columnWidth: 0.99,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "方", columnWidth: 0.01 },
                        ]
                    }


                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addHPform');
                            if (form.form.isValid()) {
                                var yundan_goods_id = Ext.getCmp("yundan_goods_id").getValue();
                                var yundan_goodsName = Ext.getCmp("yundan_goodsName").getValue();
                                var yundan_goodsPack = Ext.getCmp("yundan_goodsPack").getValue();
                                var yundan_goodsAmount = Ext.getCmp("yundan_goodsAmount").getValue();
                                var yundan_goodsWeight = Ext.getCmp("yundan_goodsWeight").getValue();
                                var yundan_goodsVolume = Ext.getCmp("yundan_goodsVolume").getValue();

                                if (yundan_goods_id) {
                                    for (var i = 0; i < HPStore.data.length; i++) {
                                        if (HPStore.data.items[i].data.yundan_goods_id == yundan_goods_id) {
                                            HPStore.data.items[i].data.yundan_goodsName = yundan_goodsName;
                                            HPStore.data.items[i].data.yundan_goodsPack = yundan_goodsPack;
                                            HPStore.data.items[i].data.yundan_goodsAmount = yundan_goodsAmount;
                                            HPStore.data.items[i].data.yundan_goodsWeight = yundan_goodsWeight;
                                            HPStore.data.items[i].data.yundan_goodsVolume = yundan_goodsVolume;
                                        }
                                    }
                                } else {
                                    CS('CZCLZ.YDMag.GetGuid', function (retVal) {
                                        if (retVal) {
                                            HPStore.add([{
                                                "yundan_goods_id": retVal,
                                                "yundan_goodsName": yundan_goodsName,
                                                "yundan_goodsPack": yundan_goodsPack,
                                                "yundan_goodsAmount": yundan_goodsAmount,
                                                "yundan_goodsWeight": yundan_goodsWeight,
                                                "yundan_goodsVolume": yundan_goodsVolume,
                                            }]);
                                        }
                                    }, CS.onError);
                                }
                                Ext.getCmp("hpgrid").reconfigure(HPStore);
                                this.up('window').close();
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

Ext.define('addDBFWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '短驳费编辑',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'addDBFform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'id',
                        name: 'id',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        id: 'driverId',
                        name: 'driverId',
                        allowBlank: false,
                        displayField: 'people',
                        valueField: 'driverId',
                        queryMode: 'local',
                        editable: false,
                        store: driverstore,
                        fieldLabel: '司机',
                        labelWidth: 70,
                        anchor: '100%',
                        listeners: {
                            'select': function (o) {
                                Ext.getCmp("tel").setValue(o.valueModels[0].data.tel);
                                Ext.getCmp("carNum").setValue(o.valueModels[0].data.carNum);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '电话',
                        name: 'tel',
                        id: 'tel',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '车牌',
                        name: 'carNum',
                        id: 'carNum',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '日期',
                        editable: false,
                        name: 'expenseDate',
                        id: 'expenseDate',
                        anchor: '100%',
                        labelWidth: 70,
                        value: new Date()
                    },

                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '费用',
                                allowBlank: false,
                                id: 'money',
                                name: 'money',
                                columnWidth: 0.99,
                                allowNegative: false,
                                minValue: 0,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "元", columnWidth: 0.01 },
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '备注',
                        name: 'memo',
                        labelWidth: 70,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addDBFform');
                            if (form.form.isValid()) {
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.YDMag.SaveDBF', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn: function () {
                                                me.up('window').close()
                                            }
                                        });
                                        BindDBF(1);
                                    }

                                }, CS.onError, values, ydid, fromofficeid, clientId);
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

Ext.define('addZZFWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '中转费编辑',

    initComponent: function () {
        var me = this;
        var zhuangchedanId = me.zhuangchedanId;
        me.items = [
            {
                xtype: 'form',
                id: 'addZZFform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'id',
                        name: 'id',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        name: 'zhongzhuanId',
                        allowBlank: false,
                        displayField: 'compName',
                        valueField: 'zhongzhuanId',
                        queryMode: 'local',
                        editable: false,
                        store: zhongzhuanstore,
                        fieldLabel: '公司',
                        labelWidth: 70,
                        anchor: '100%',
                        listeners: {
                            'select': function (o) {
                                Ext.getCmp("zzpeople").setValue(o.valueModels[0].data.people);
                                Ext.getCmp("zztel").setValue(o.valueModels[0].data.tel);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系人',
                        name: 'zzpeople',
                        id: 'zzpeople',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系电话',
                        name: 'zztel',
                        id: 'zztel',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '日期',
                        editable: false,
                        name: 'expenseDate',
                        anchor: '100%',
                        labelWidth: 70,
                        value: new Date()
                    },

                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '金额',
                                allowBlank: false,
                                name: 'money',
                                columnWidth: 0.99,
                                allowNegative: false,
                                minValue: 0,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "元", columnWidth: 0.01 },
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '备注',
                        name: 'memo',
                        labelWidth: 70,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addZZFform');
                            if (form.form.isValid()) {
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.YDMag.SaveZZF', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn: function () {
                                                me.up('window').close()
                                            }
                                        });
                                        BindZZF(1);
                                    }

                                }, CS.onError, values, ydid, toofficeid, clientId, zhuangchedanId);
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

Ext.define('addSHFWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '送货费编辑',

    initComponent: function () {
        var me = this;
        var zhuangchedanId = me.zhuangchedanId;
        me.items = [
            {
                xtype: 'form',
                id: 'addSHFform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'id',
                        name: 'id',
                        labelWidth: 70,
                        hidden: true,
                        anchor: '100%'
                    },
                    {
                        xtype: 'combobox',
                        name: 'driverId',
                        allowBlank: false,
                        displayField: 'people',
                        valueField: 'driverId',
                        queryMode: 'local',
                        editable: false,
                        store: driverstore,
                        fieldLabel: '司机',
                        labelWidth: 70,
                        anchor: '100%',
                        listeners: {
                            'select': function (o) {
                                Ext.getCmp("shtel").setValue(o.valueModels[0].data.tel);
                                Ext.getCmp("shcarNum").setValue(o.valueModels[0].data.carNum);
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '电话',
                        name: 'shtel',
                        id: 'shtel',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '车牌',
                        name: 'shcarNum',
                        id: 'shcarNum',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '日期',
                        editable: false,
                        name: 'expenseDate',
                        anchor: '100%',
                        labelWidth: 70,
                        value: new Date()
                    },

                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '金额',
                                allowBlank: false,
                                name: 'money',
                                columnWidth: 0.99,
                                allowNegative: false,
                                minValue: 0,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "元", columnWidth: 0.01 },
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '备注',
                        name: 'memo',
                        labelWidth: 70,
                        anchor: '100%'
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('addSHFform');
                            if (form.form.isValid()) {
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.YDMag.SaveSHF', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn: function () {
                                                me.up('window').close()
                                            }
                                        });
                                        BindSHF(1);
                                    }

                                }, CS.onError, values, ydid, toofficeid, clientId, zhuangchedanId);
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

Ext.define('DBFList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 700,
    height: 300,
    layout: {
        type: 'fit'
    },
    title: '短驳费设置',
    id: 'DBFListWin',
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
                            id: 'DBFListpanel',
                            store: dbfstore,
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
                                    dataIndex: 'people',
                                    flex: 1,
                                    text: '司机姓名',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    dataIndex: 'tel',
                                    flex: 1,
                                    text: '电话',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'carNum',
                                    flex: 1,
                                    text: '车牌号',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    xtype: 'datecolumn',
                                    format: 'Y-m-d',
                                    dataIndex: 'expenseDate',
                                    flex: 1,
                                    text: '提货时间',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'money',
                                    flex: 1,
                                    text: '短驳费(元)',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'memo',
                                    flex: 1,
                                    text: '备注',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'id',
                                    sortable: false,
                                    menuDisabled: true,
                                    text: '操作',
                                    width: 100,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        return "<a href='JavaScript:void(0)' onclick='xgdbf(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='deldbf(\"" + value + "\")'>删除</a>";
                                    }
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'buttongroup',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '新增',
                                                    handler: function () {
                                                        CS('CZCLZ.YDMag.GetDriver', function (retVal) {
                                                            driverstore.loadData(retVal);
                                                            var win = new addDBFWin();
                                                            win.show();
                                                        }, CS.onError)

                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    store: dbfstore,
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

Ext.define('FLFList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 700,
    height: 300,
    layout: {
        type: 'fit'
    },
    title: '分流费设置',
    id: 'FLFListWin',
    initComponent: function () {
        var me = this;
        var zhuangchedanId = me.zhuangchedanId;
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    layout: {
                        type: 'fit'
                    },
                    autoScroll: true,
                    dockedItems: [
                    ],
                    items: [
                        {
                            xtype: 'gridpanel',
                            id: 'ZZFListpanel',
                            title: '中转费',
                            store: zzfstore,
                            itemId: 'tab1',
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
                                    dataIndex: 'compName',
                                    flex: 1,
                                    text: '中转公司',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    dataIndex: 'people',
                                    flex: 1,
                                    text: '联系人',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'tel',
                                    flex: 1,
                                    text: '电话',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    xtype: 'datecolumn',
                                    format: 'Y-m-d',
                                    dataIndex: 'expenseDate',
                                    flex: 1,
                                    text: '中转时间',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'money',
                                    flex: 1,
                                    text: '中转费(元)',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'memo',
                                    flex: 1,
                                    text: '备注',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'id',
                                    sortable: false,
                                    menuDisabled: true,
                                    text: '操作',
                                    width: 100,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        return "<a href='JavaScript:void(0)' onclick='xgzzf(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='deldbf(\"" + value + "\")'>删除</a>";
                                    }
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'buttongroup',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '新增',
                                                    handler: function () {
                                                        CS('CZCLZ.YDMag.GetZhongZhuan', function (retVal) {
                                                            zhongzhuanstore.loadData(retVal);
                                                            console.log(zhongzhuanstore);
                                                            var win = new addZZFWin({ zhuangchedanId: zhuangchedanId });
                                                            win.show();
                                                        }, CS.onError)

                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    store: zzfstore,
                                    dock: 'bottom'
                                }
                            ]

                        }, {
                            xtype: 'gridpanel',
                            id: 'SHFListpanel',
                            store: shfstore,
                            title: '送货费',
                            itemId: 'tab2',
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
                                    dataIndex: 'people',
                                    flex: 1,
                                    text: '司机姓名',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    dataIndex: 'tel',
                                    flex: 1,
                                    text: '电话',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'carNum',
                                    flex: 1,
                                    text: '车牌号',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    xtype: 'datecolumn',
                                    format: 'Y-m-d',
                                    dataIndex: 'expenseDate',
                                    flex: 1,
                                    text: '送货时间',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'money',
                                    flex: 1,
                                    text: '送货费(元)',
                                    sortable: false,
                                    menuDisabled: true
                                }, {
                                    dataIndex: 'memo',
                                    flex: 1,
                                    text: '备注',
                                    sortable: false,
                                    menuDisabled: true
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'id',
                                    sortable: false,
                                    menuDisabled: true,
                                    text: '操作',
                                    width: 100,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        return "<a href='JavaScript:void(0)' onclick='xgshf(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='deldbf(\"" + value + "\")'>删除</a>";
                                    }
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'buttongroup',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '新增',
                                                    handler: function () {
                                                        CS('CZCLZ.YDMag.GetDriver', function (retVal) {
                                                            driverstore.loadData(retVal);
                                                            var win = new addSHFWin({ zhuangchedanId: zhuangchedanId });
                                                            win.show();
                                                        }, CS.onError)

                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'pagingtoolbar',
                                    displayInfo: true,
                                    store: shfstore,
                                    dock: 'bottom'
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

Ext.define('HDWin', {
    extend: 'Ext.window.Window',

    height: 250,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '回单登记',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'HDform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        id: 'isSign',
                        name: 'isSign',
                        allowBlank: false,
                        displayField: 'TXT',
                        valueField: 'VAL',
                        queryMode: 'local',
                        editable: false,
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['否', 0],
                                ['是', 1]
                            ]
                        }),
                        fieldLabel: '是否收到',
                        labelWidth: 70,
                        anchor: '100%',
                        listeners: {
                            'select': function (o) {
                                if (o.valueModels[0].data.VAL == 0) {
                                    Ext.getCmp("bschuidanDate").disable();
                                    Ext.getCmp("huidanDate").disable();
                                    Ext.getCmp("huidanBack").disable();
                                } else if (o.valueModels[0].data.VAL == 1) {
                                    Ext.getCmp("bschuidanDate").enable();
                                    Ext.getCmp("huidanDate").enable();
                                    Ext.getCmp("huidanBack").enable();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '办事处寄回单日期',
                        editable: false,
                        name: 'bschuidanDate',
                        id: 'bschuidanDate',
                        anchor: '100%',
                        labelWidth: 70,
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '到总部日期',
                        editable: false,
                        name: 'huidanDate',
                        id: 'huidanDate',
                        anchor: '100%',
                        labelWidth: 70,
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '给客户日期',
                        editable: false,
                        name: 'huidanBack',
                        id: 'huidanBack',
                        anchor: '100%',
                        labelWidth: 70,
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '送货方手机',
                                allowBlank: false,
                                id: 'shsj',
                                name: 'shsj',
                                columnWidth: 0.85,
                                allowNegative: false,
                                minValue: 0,
                                labelWidth: 70,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "发短信", columnWidth: 0.15 },
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('HDform');
                            if (form.form.isValid()) {
                                //取得表单中的内容
                                var values = form.form.getValues(false);
                                var me = this;
                                CS('CZCLZ.YDMag.SaveHD', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO,
                                            fn: function () {
                                                me.up('window').close()
                                            }
                                        });
                                    }
                                    me.up('window').close()
                                }, CS.onError, ydid, values);
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

Ext.define('BQDYWin', {
    extend: 'Ext.window.Window',

    height: 160,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '打印标签[参数设置]',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'BQDYform',
                frame: true,
                bodyPadding: 10,
                items: [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '已打印的数量',
                                allowBlank: false,
                                id: 'ydysl',
                                name: 'ydysl',
                                columnWidth: 0.85,
                                allowNegative: false,
                                labelWidth: 110,
                                minValue: 0,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "个", columnWidth: 0.15 },
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'column'
                        },
                        margin: '10 0 10 0',
                        anchor: '100%',
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: '本次要打印的数量',
                                allowBlank: false,
                                id: 'bcydysl',
                                name: 'bcydysl',
                                columnWidth: 0.85,
                                allowNegative: false,
                                minValue: 0,
                                labelWidth: 110,
                                anchor: '100%'
                            },
                            { xtype: "displayfield", value: "个", columnWidth: 0.15 },
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '打印预览',
                        handler: function () {
                            var form = Ext.getCmp('BQDYform');
                            if (form.form.isValid()) {
                                var length = Ext.getCmp("bcydysl").getValue();
                                CS('CZCLZ.PrinterMag.GetPrintBQ', function (retVal) {
                                    var LODOP1 = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
                                    LODOP1.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
                                    LODOP1.SET_PRINT_PAGESIZE(0, 800, 510, "A4");                                    LODOP1.SET_PRINT_STYLE("FontSize", 12);
                                    LODOP1.SET_PRINT_STYLE("Bold", 1);
                                    //if (retVal.ztdt.length > 0) {
                                    //if (retVal.printdt.length > 0) {
                                    var html = '<table width="100%" align="center" border="0" height="100%" cellpadding="0" cellspacing="0"><tr><td>';
                                    html += '<table width="100%" align="center" height="50" cellpadding="0" cellspacing="0" style="border-bottom:2px solid black"><tr><td width="100%" style="text-align:center;font-weight:bold">查货宝</td></tr>';
                                    html += '<tr><td width="100%" style="text-align:center;">' + Ext.getCmp("officeId").getRawValue() + '至' + Ext.getCmp("toOfficeId").getRawValue() + '</td></tr></table>';
                                    html += '<table width="100%" align="center" border="0"cellpadding="0" cellspacing="0" style="border-bottom:1px solid black"><tr style="border-bottom:1px solid black"><td width="50%" style="line-height:180%">' + Ext.getCmp("yundanNum").getValue() + '</td><td>到站：' + Ext.getCmp("toAddress").getValue() + '</td></tr></table>';
                                    html += '<table width="100%" align="center" border="0"cellpadding="0" cellspacing="0" style="border-bottom:1px solid black"><tr style="border-bottom:1px solid black"><td width="50%" style="line-height:180%">货名：' + HPStore.data.items[0].data.yundan_goodsName + '</td><td>收货人：' + Ext.getCmp("shouhuoPeople").getValue() + '</td></tr></table>';
                                    html += '<table width="100%" align="center" border="0"cellpadding="0" cellspacing="0" style="border-bottom:1px solid black"><tr style="border-bottom:1px solid black"><td width="50%" style="line-height:180%">包装：' + HPStore.data.items[0].data.yundan_goodsPack + '</td><td>件数：' + HPStore.data.items[0].data.yundan_goodsAmount + '</td></tr></table>';
                                    html += '<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0"><tr><td  style="line-height:180%">电话：' + Ext.getCmp("shouhuoTel").getValue() + '</td></tr></table>';
                                    html += '</td></tr></table>';

                                    for (j = 0; j < length; j++) {
                                        LODOP1.NewPage();

                                        LODOP1.ADD_PRINT_HTM(0, 0, "100%", "100%", html);
                                        //for (var i = 0; i < retVal.printdt.length; i++) {

                                        //    if (retVal.printdt[i]["fieldMC"] == "第一个地址") {
                                        //        LODOP1.ADD_PRINT_TEXT(66, 66, 200, 20, "到站：" + Ext.getCmp("toAddress").getValue());
                                        //    }
                                        //    if (retVal.printdt[i]["fieldMC"] == "第一个收件人名") {
                                        //        LODOP1.ADD_PRINT_TEXT(retVal.printdt[i]["leftBJ"], retVal.printdt[i]["topBJ"], 200, 20, "收货人：" + Ext.getCmp("shouhuoPeople").getValue());
                                        //    }
                                        //    if (retVal.printdt[i]["fieldMC"] == "第一个收件人电话") {
                                        //        LODOP1.ADD_PRINT_TEXT(retVal.printdt[i]["leftBJ"], retVal.printdt[i]["topBJ"], 200, 20, "电话：" + Ext.getCmp("shouhuoTel").getValue());
                                        //    }
                                        //    if (retVal.printdt[i]["fieldMC"] == "货物名称") {
                                        //        LODOP1.ADD_PRINT_TEXT(retVal.printdt[i]["leftBJ"], retVal.printdt[i]["topBJ"], 200, 20, "货名：" + HPStore.data.items[0].data.yundan_goodsName);
                                        //    }
                                        //    if (retVal.printdt[i]["fieldMC"] == "件数") {
                                        //        LODOP1.ADD_PRINT_TEXT(retVal.printdt[i]["leftBJ"], retVal.printdt[i]["topBJ"], 200, 20, "件数：" + HPStore.data.items[0].data.yundan_goodsAmount);
                                        //    }
                                        //    if (retVal.printdt[i]["fieldMC"] == "包装") {
                                        //        LODOP1.ADD_PRINT_TEXT(retVal.printdt[i]["leftBJ"], retVal.printdt[i]["topBJ"], 200, 20, "包装：" + HPStore.data.items[0].data.yundan_goodsPack);
                                        //    }
                                        //}
                                        //var topBJ = 0;
                                        //if (retVal.ztdt[0]["topBJ"]) {
                                        //    topBJ = retVal.ztdt[0]["topBJ"];
                                        //}
                                        //var leftBJ = 0;
                                        //if (retVal.ztdt[0]["leftBJ"]) {
                                        //    leftBJ = retVal.ztdt[0]["leftBJ"];
                                        //}
                                        // LODOP1.ADD_PRINT_HTM(topBJ, leftBJ, "100%", "100%");
                                        // }
                                        //  }
                                    }
                                    LODOP1.PREVIEW();

                                }, CS.onError);
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
                                                text: '保存',
                                                handler: function () {


                                                    var form = Ext.getCmp('addform');
                                                    if (form.form.isValid()) {

                                                        var fahuoPeople = Ext.getCmp("fahuoPeople").getValue();
                                                        var fahuoPeople_dispaly = Ext.getCmp("fahuoPeople").getRawValue();
                                                        var fahuoTel = Ext.getCmp("fahuoTel").getValue();
                                                        var faAddress = Ext.getCmp("faAddress").getValue();
                                                        if (!fahuoPeople) {
                                                            Ext.MessageBox.confirm("提示", "检测到输入的发货人为新客户，客户档案中会新增，确认吗?", function (obj) {
                                                                if (obj == "yes") {
                                                                    CS('CZCLZ.YDMag.CreateKH', function (retVal) {
                                                                        if (retVal) {
                                                                            Ext.getCmp("fahuoPeople").setValue(retVal);
                                                                        }
                                                                    }, CS.onError, fahuoPeople_dispaly, fahuoTel, faAddress, Ext.getCmp("officeId").getValue());
                                                                }
                                                                else {
                                                                    return;
                                                                }
                                                            });
                                                        }



                                                        var songhuoType = Ext.getCmp("songhuoType").getValue();
                                                        if (songhuoType === "") {
                                                            Ext.Msg.alert('提示', "送货方式不能为空！");
                                                            return;
                                                        }

                                                        var payType = Ext.getCmp("payType").getValue();
                                                        if (payType === "") {
                                                            Ext.Msg.alert('提示', "结算方式不能为空！");
                                                            return;
                                                        }

                                                        var huidanType = Ext.getCmp("huidanType").getValue();
                                                        if (huidanType === "") {
                                                            Ext.Msg.alert('提示', "回单收条不能为空！");
                                                            return;
                                                        }

                                                        var cntHuidan = Ext.getCmp("cntHuidan").getValue();
                                                        if (cntHuidan === "" || cntHuidan < 1) {
                                                            Ext.Msg.alert('提示', "回单数必须大于0！");
                                                            return;
                                                        }

                                                        var moneyXianfu = Ext.getCmp("moneyXianfu").getValue();
                                                        var moneyQianfu = Ext.getCmp("moneyQianfu").getValue();
                                                        var moneyDaofu = Ext.getCmp("moneyDaofu").getValue();
                                                        var moneyHuidanfu = Ext.getCmp("moneyHuidanfu").getValue();
                                                        var moneyYunfei = Ext.getCmp("moneyYunfei").getValue();

                                                        if (moneyYunfei != moneyXianfu + moneyQianfu + moneyDaofu + moneyHuidanfu) {
                                                            Ext.Msg.alert('提示', "运费金额必须等于：现付+到付+欠付+回单付 !");
                                                            return;
                                                        }

                                                        var hplist = [];
                                                        if (HPStore.data.length <= 0) {
                                                            Ext.Msg.alert('提示', "运单至少含有一件的货品!");
                                                            return;
                                                        } else {
                                                            for (var i = 0; i < HPStore.data.items.length; i++) {
                                                                hplist.push(HPStore.data.items[i].data);
                                                            }
                                                        }


                                                        //取得表单中的内容
                                                        var values = form.form.getValues(false);
                                                        var me = this;

                                                        CS('CZCLZ.YDMag.SaveYD', function (retVal) {
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

                                                        }, CS.onError, ydid, values, hplist, fahuoPeople_dispaly);

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
                                                text: "费用设置",
                                                iconCls: "application",
                                                arrowAlign: "right",
                                                menu: [
                                                    {
                                                        text: "短驳费", handler: function () {
                                                            if (ydid) {
                                                                var win = new DBFList();
                                                                win.show();
                                                                BindDBF(1);
                                                            } else {
                                                                Ext.Msg.alert('提示', "未保存的运单禁止设置费用！");
                                                                return;
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "分流费", handler: function () {
                                                            if (ydid) {
                                                                CS('CZCLZ.YDMag.PDZC', function (retVal) {
                                                                    if (retVal) {
                                                                        var win = new FLFList({ zhuangchedanId: retVal });
                                                                        win.show();
                                                                        BindSHF(1);
                                                                        BindZZF(1);
                                                                    }
                                                                    else {
                                                                        Ext.Msg.alert('提示', "该运单还存在未装车的单子！");
                                                                        return;
                                                                    }
                                                                }, CS.onError, ydid, Ext.getCmp("yundanNum").getValue())
                                                            } else {
                                                                Ext.Msg.alert('提示', "未保存的运单禁止设置分流费用！");
                                                                return;
                                                            }
                                                        }
                                                    }
                                                ]
                                            }]
                                    },
                                    {
                                        xtype: 'buttongroup',
                                        title: '',
                                        items: [
                                            {
                                                xtype: "button",
                                                text: "打印",
                                                iconCls: "printer",
                                                arrowAlign: "right",
                                                menu: [
                                                    {
                                                        text: "标签", handler: function () {
                                                            if (ydid) {
                                                                var win = new BQDYWin();
                                                                win.show();
                                                            } else {
                                                                Ext.Msg.alert('提示', "请先保存运单！");
                                                                return;
                                                            }

                                                        }
                                                    },
                                                    {
                                                        text: "信封（预览）", handler: function () {
                                                            if (ydid) {
                                                                CS('CZCLZ.PrinterMag.GetPrintByKind', function (retVal) {
                                                                    var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
                                                                    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
                                                                    LODOP.SET_PRINT_PAGESIZE(0, 2500, 1200, "A4");                                                                    LODOP.SET_PRINT_STYLE("FontSize", 18);
                                                                    LODOP.SET_PRINT_STYLE("Bold", 1);
                                                                    if (retVal.ztdt.length > 0) {
                                                                        if (retVal.printdt.length > 0) {
                                                                            for (var i = 0; i < retVal.printdt.length; i++) {

                                                                                if (Ext.getCmp("songhuoType").getValue() == 0) {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "自提") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 20, 20, "自提");
                                                                                    }
                                                                                } else {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "送货") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 20, 20, "送货");
                                                                                    }
                                                                                }

                                                                                if (Ext.getCmp("huidanType").getValue() == 0) {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "回单") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, "回单:" + Ext.getCmp("cntHuidan").getValue());
                                                                                    }
                                                                                } else {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "收条") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, "收条:" + Ext.getCmp("cntHuidan").getValue());
                                                                                    }
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "备注") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("memo").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "运单号") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("yundanNum").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "货物名称") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsName);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "件数") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsAmount);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "包装") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsPack);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "重量") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsWeight + "T");
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "体积") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsVolume + "m³");
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "地址") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoAddress").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "联系人") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoPeople").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "电话") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoTel").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "到付") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("moneyDaofu").getValue());
                                                                                }


                                                                            }
                                                                        }
                                                                        var topBJ = 0;
                                                                        if (retVal.ztdt[0]["topBJ"]) {
                                                                            topBJ = retVal.ztdt[0]["topBJ"];
                                                                        }
                                                                        var leftBJ = 0;
                                                                        if (retVal.ztdt[0]["leftBJ"]) {
                                                                            leftBJ = retVal.ztdt[0]["leftBJ"];
                                                                        }
                                                                        LODOP.ADD_PRINT_HTM(topBJ, leftBJ, "100%", "100%");
                                                                    }
                                                                    LODOP.PREVIEW();
                                                                }, CS.onError, 0);
                                                            } else {
                                                                Ext.Msg.alert('提示', "请先保存运单！");
                                                                return;
                                                            }
                                                        }
                                                    },
                                                    {
                                                        text: "运单（预览）", iconCls: "preview", handler: function () {
                                                            if (ydid) {
                                                                CS('CZCLZ.PrinterMag.GetPrintYD', function (retVal) {
                                                                    var LODOP = getLodop(document.getElementById('LODOP_OB'), document.getElementById('LODOP_EM'));
                                                                    LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
                                                                    LODOP.SET_PRINT_PAGESIZE(0, 3000, 3000, "A4");                                                                    LODOP.SET_PRINT_STYLE("FontSize", 18);
                                                                    LODOP.SET_PRINT_STYLE("Bold", 1);
                                                                    if (retVal.ztdt.length > 0) {
                                                                        if (retVal.printdt.length > 0) {
                                                                            for (var i = 0; i < retVal.printdt.length; i++) {

                                                                                if (Ext.getCmp("songhuoType").getValue() == 0) {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "自提") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] == null ? 0 : retVal.printdt[i]["topBJ"], retVal.printdt[i]["leftBJ"] == null ? 0 : retVal.printdt[i]["leftBJ"], 20, 20, "自提");
                                                                                    }
                                                                                } else {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "送货") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] == null ? 0 : retVal.printdt[i]["topBJ"], retVal.printdt[i]["leftBJ"] == null ? 0 : retVal.printdt[i]["leftBJ"], 20, 20, "送货");
                                                                                    }
                                                                                }

                                                                                if (Ext.getCmp("huidanType").getValue() == 0) {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "回单数") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] == null ? 0 : retVal.printdt[i]["topBJ"], retVal.printdt[i]["leftBJ"] == null ? 0 : retVal.printdt[i]["leftBJ"], 200, 20, "回单:" + Ext.getCmp("cntHuidan").getValue());
                                                                                    }
                                                                                } else {
                                                                                    if (retVal.printdt[i]["fieldMC"] == "收条数") {
                                                                                        LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] == null ? 0 : retVal.printdt[i]["topBJ"], retVal.printdt[i]["leftBJ"] == null ? 0 : retVal.printdt[i]["leftBJ"], 200, 20, "收条:" + Ext.getCmp("cntHuidan").getValue());
                                                                                    }
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "公司地址1（到达办事处）") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("officeId").getRawValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "公司地址2（起始办事处）") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("toOfficeId").getRawValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "起运地点") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("officeId").getRawValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "到达网点") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("toAddress").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "欠付") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("moneyQianfu").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "已付") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"], 200, 20, Ext.getCmp("moneyYunfei").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "备注") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("memo").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "运单编号") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("yundanNum").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "收货人（单位）") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoPeople").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "收货地址") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoAddress").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "收货电话") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("shouhuoTel").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "托运人（单位）") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("fahuoPeople").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "托运地址") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("faAddress").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "托运电话") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, Ext.getCmp("fahuoTel").getValue());
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "货物名称") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsName);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "件数") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsAmount);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "包装") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsPack);
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "重量") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsWeight + "T");
                                                                                }
                                                                                if (retVal.printdt[i]["fieldMC"] == "体积") {
                                                                                    LODOP.ADD_PRINT_TEXT(retVal.printdt[i]["topBJ"] * 5, retVal.printdt[i]["leftBJ"] * 4, 200, 20, HPStore.data.items[0].data.yundan_goodsVolume + "m³");
                                                                                }



                                                                            }
                                                                        }
                                                                        var topBJ = 0;
                                                                        if (retVal.ztdt[0]["topBJ"]) {
                                                                            topBJ = retVal.ztdt[0]["topBJ"];
                                                                        }
                                                                        var leftBJ = 0;
                                                                        if (retVal.ztdt[0]["leftBJ"]) {
                                                                            leftBJ = retVal.ztdt[0]["leftBJ"];
                                                                        }
                                                                        LODOP.ADD_PRINT_HTM(topBJ, leftBJ, "100%", "100%");
                                                                    }
                                                                    LODOP.PREVIEW();
                                                                }, CS.onError);
                                                            } else {
                                                                Ext.Msg.alert('提示', "请先保存运单！");
                                                                return;
                                                            }

                                                        }
                                                    }

                                                ]
                                            }]
                                    },
                                    {
                                        xtype: 'buttongroup',
                                        title: '',
                                        items: [
                                            {
                                                xtype: "button",
                                                text: "更多",
                                                iconCls: "application",
                                                arrowAlign: "right",
                                                menu: [
                                                    {
                                                        text: "运单拆分", handler: function () {
                                                            if (ydid) {
                                                                FrameStack.pushFrame({
                                                                    url: "CFYD.html?ydid=" + ydid
                                                                });
                                                            } else {
                                                                Ext.Msg.alert('提示', "未保存的运单禁止拆分！");
                                                                return;
                                                            }

                                                        }
                                                    },
                                                    {
                                                        text: "回单设置", handler: function () {
                                                            if (ydid) {

                                                                CS('CZCLZ.YDMag.GetHDByID', function (retVal) {
                                                                    if (retVal) {
                                                                        var win = new HDWin();
                                                                        win.show();
                                                                        Ext.getCmp("shsj").setValue(retVal[0]["fahuoTel"]);
                                                                        if (retVal[0]["isSign"] == 1) {

                                                                            Ext.getCmp("isSign").setValue(1);
                                                                            Ext.getCmp("bschuidanDate").enable();
                                                                            Ext.getCmp("bschuidanDate").setValue(retVal[0]["bschuidanDate"]);
                                                                            Ext.getCmp("huidanDate").enable();
                                                                            Ext.getCmp("huidanDate").setValue(retVal[0]["huidanDate"]);
                                                                            Ext.getCmp("huidanBack").enable();
                                                                            Ext.getCmp("huidanBack").setValue(retVal[0]["huidanBack"]);
                                                                        } else {
                                                                            Ext.getCmp("isSign").setValue(0);
                                                                            Ext.getCmp("bschuidanDate").disable();
                                                                            Ext.getCmp("huidanDate").disable();
                                                                            Ext.getCmp("huidanBack").disable();
                                                                        }
                                                                    }
                                                                }, CS.onError, ydid);

                                                            } else {
                                                                Ext.Msg.alert('提示', "未保存的运单禁止设置！");
                                                                return;
                                                            }
                                                        }
                                                    },
                                                    { text: "核销日志" }
                                                ]
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
                                                name: 'yundanNum',
                                                id: 'yundanNum',
                                                columnWidth: 0.33,
                                                margin: '5 10 5 10',
                                                fieldLabel: '运单号',
                                                labelWidth: 70,
                                                value: new Date().Format("yyyyMMddhhmmssS"),
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
                                                labelWidth: 70,
                                                value: 0,
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
                                                labelWidth: 70,
                                                value: 0,
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
                                                minValue: 0,
                                                labelWidth: 70,
                                                value: 0,
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
                                                minValue: 0,
                                                name: 'moneyHuikouQianFan',
                                                id: 'moneyHuikouQianFan',
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
                                                name: 'moneyHuikouXianFan',
                                                id: 'moneyHuikouXianFan',
                                                labelWidth: 70,
                                                store: new Ext.data.ArrayStore({
                                                    fields: ['TXT', 'VAL'],
                                                    data: [
                                                        ['回扣现付', ""],
                                                        ['是', 0],
                                                        ['否', 1]
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
                                                labelWidth: 70

                                            },
                                            { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                            {
                                                xtype: 'numberfield',
                                                columnWidth: 0.32,
                                                margin: '5 2 5 10',
                                                fieldLabel: '代收手续费',
                                                allowNegative: false,
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
                                                        ['回单', 0],
                                                        ['收条', 1]
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
                                                dataIndex: 'yundan_goodsName',
                                                format: 'Y-m',
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
                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goods_id',
                                                sortable: false,
                                                menuDisabled: true,
                                                text: '操作',
                                                width: 200,
                                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                    return "<a href='JavaScript:void(0)' onclick='xghp(\""
                                                        + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='delhp(\""
                                                        + value + "\")'>删除</a>";
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
                                                        xtype: 'buttongroup',
                                                        title: '',
                                                        items: [
                                                            {
                                                                xtype: 'button',
                                                                iconCls: 'add',
                                                                text: '新增',
                                                                handler: function () {
                                                                    var win = new addHPWin();
                                                                    win.show();
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
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
            }
        }, CS.onError, ydid);

    }
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

