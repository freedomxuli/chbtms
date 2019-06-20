var pageSize = 15;
var ydid = "";
var zcfdid = "";
//************************************数据源*****************************************
var store = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'zhuangchedan_id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'people' },
        { name: 'toAddress' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'songhuoType' },
        { name: 'moneyYunfei' },
        { name: 'moneyHuiKou' },
        { name: 'memo' },
        { name: 'YDJSHF' },
        { name: 'YDJZZF' },
        { name: 'YHXSHF' },
        { name: 'YHXZZF' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        GetYunDanList(nPage);
    }
});

var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'mc' }
    ]
});

var compStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'mc' }
    ]
});

var driverStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'id' },
        { name: 'mc' }
    ]
});

//中转费store
var zzfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'id' },
        { name: 'cwid' },
        { name: 'compName' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'actionDate' },
        { name: 'money' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindZZF(nPage);
    }
});

//送货store
var shfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'id' },
        { name: 'cwid' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'carNum' },
        { name: 'actionDate' },
        { name: 'money' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindSHF(nPage);
    }
});

//中转公司store
var zhongzhuanstore = Ext.create('Ext.data.Store', {
    fields: ['zhongzhuanId', 'compName', 'people', 'tel'],
    data: [
    ]
});

//司机store
var driverstore = Ext.create('Ext.data.Store', {
    fields: ['driverId', 'people', 'tel', 'carNum'],
    data: [
    ]
});

//货品store
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
//************************************数据源*****************************************

//************************************页面方法***************************************
function GetYunDanList(nPage) {
    CS('CZCLZ.Finance.GetYunDanList', function (retVal) {
        store.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_bsc").getValue(), Ext.getCmp("start_time").getValue(), Ext.getCmp("end_time").getValue(), Ext.getCmp("cx_zcd").getValue(), Ext.getCmp("cx_ydh").getValue(), Ext.getCmp("cx_isfl").getValue());
}

function GetOffice() {
    CS('CZCLZ.Finance.GetOfficeList', function (retVal) {
        if (retVal) {
            bscStore.loadData(retVal);
        }
    }, CS.onError);
}

function GetCompany() {
    CS('CZCLZ.Finance.GetCompanyList', function (retVal) {
        if (retVal) {
            compStore.loadData(retVal);
        }
    }, CS.onError);
}

function GetDriver() {
    CS('CZCLZ.Finance.GetDriverList', function (retVal) {
        if (retVal) {
            driverStore.loadData(retVal);
        }
    }, CS.onError);
}

function EditFenLiu(id, yundanid,cfdid) {
    var win = new FLFList({ zhuangchedanId: id});
    win.show();
    ydid = yundanid;
    zcfdid = cfdid;
    BindSHF(1);
    BindZZF(1);
}

//获取中转公司明细
function GetZhongZhuan() {
    CS('CZCLZ.YDMag.GetZhongZhuan', function (retVal) {
        zhongzhuanstore.loadData(retVal);
    }, CS.onError)
}

//获取中转费明细
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

//中转费编辑
function xgzzf(id) {
    if (privilege("财务核销管理_货物分流核销_修改删除")) {
        CS('CZCLZ.YDMag.GetZhongZhuan', function (ret) {
            zhongzhuanstore.loadData(ret);
            CS('CZCLZ.YDMag.GetZZFById', function (retVal) {

                if (retVal) {
                    var win = new addZZFWin();
                    win.show(null, function () {
                        var form = Ext.getCmp('addZZFform');
                        form.form.setValues(retVal[0]);
                    });
                }
            }, CS.onError, id);
        }, CS.onError)
    }
}

//获取送货费明细
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

//送货费编辑
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

//查看运单货品明细
function LookGoods(id) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, id);
    });
}

//删除短驳分流费
function deldbf(id, cwid) {
    if (privilege("财务核销管理_货物分流核销_修改删除")) {
        Ext.MessageBox.confirm("提示", "是否删除?", function (obj) {
            if (obj == "yes") {
                CS('CZCLZ.YDMag.DeleteDBFById', function (retVal) {
                    if (retVal) {
                        BindSHF(1);
                        BindZZF(1);
                    }
                }, CS.onError, id, cwid);
            }
        });
    }
}
//************************************页面方法***************************************
Ext.define('HPWin', {
    extend: 'Ext.window.Window',

    height: 400,
    width: 600,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '货品查看',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'fit'
                },
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
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
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
    id: 'win_zzf',
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
                        name: 'people',
                        id: 'zzpeople',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '联系电话',
                        name: 'tel',
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
                        name: 'actionDate',
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
                            CS('CZCLZ.YDMag.Ex_IsLockByYd', function (bo) {
                                if (!bo) {
                                    var form = Ext.getCmp('addZZFform');
                                    if (form.form.isValid()) {
                                        var values = form.form.getValues(false);
                                        //values["officeId"] = toofficeid;
                                        //values["clientId"] = clientId;
                                        CS('CZCLZ.YDMag.SaveZZF', function (retVal) {
                                            if (retVal) {
                                                Ext.Msg.show({
                                                    title: '提示',
                                                    msg: '保存成功!',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO,
                                                    fn: function () {
                                                        Ext.getCmp('win_zzf').close();
                                                    }
                                                });
                                                BindZZF(1);
                                            }

                                        }, CS.onError, values, ydid, zcfdid, zhuangchedanId);
                                    }
                                } else {
                                    Ext.Msg.alert('提示', "运单已锁定：所在装车单，单车毛利已审核！");
                                    return;
                                }
                            }, CS.onError, ydid, 2)
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
    id: 'win_shf',
    initComponent: function () {
        var me = this;
        var zhuangchedanId = me.zhuangchedanId;
        me.items = [
            {
                xtype: 'form',
                id: 'addSHFform',
                frame: true,
                bodyPadding: 10,
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
                        name: 'tel',
                        id: 'shtel',
                        labelWidth: 70,
                        anchor: '100%',
                        readOnly: true,
                        fieldStyle: 'color:#999999;background-color: #E6E6E6; background-image: none;'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '车牌',
                        name: 'carNum',
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
                        name: 'actionDate',
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
                            CS('CZCLZ.YDMag.Ex_IsLockByYd', function (bo) {
                                if (!bo) {
                                    var form = Ext.getCmp('addSHFform');
                                    if (form.form.isValid()) {
                                        var values = form.form.getValues(false);
                                        //values["officeId"] = toofficeid;
                                        //values["clientId"] = clientId;

                                        CS('CZCLZ.YDMag.SaveSHF', function (retVal) {
                                            if (retVal) {
                                                Ext.Msg.show({
                                                    title: '提示',
                                                    msg: '保存成功!',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO,
                                                    fn: function () {
                                                        Ext.getCmp('win_shf').close();
                                                    }
                                                });
                                                BindSHF(1);
                                            }

                                        }, CS.onError, values, ydid, zcfdid, zhuangchedanId);
                                    }
                                } else {
                                    Ext.Msg.alert('提示', "运单已锁定：所在装车单，单车毛利已审核！");
                                    return;
                                }
                            }, CS.onError, ydid, '3')
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
                                    dataIndex: 'actionDate',
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
                                        return "<a href='JavaScript:void(0)' onclick='xgzzf(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='deldbf(\"" + value + "\",\"" + record.data.cwid + "\")'>删除</a>";
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
                                                        var win = new addZZFWin({ zhuangchedanId: zhuangchedanId });
                                                        win.show(null, function () {
                                                            CS('CZCLZ.YDMag.GetZhongZhuan', function (retVal) {
                                                                zhongzhuanstore.loadData(retVal);

                                                            }, CS.onError)
                                                        });
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
                                    dataIndex: 'actionDate',
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
                                        return "<a href='JavaScript:void(0)' onclick='xgshf(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='deldbf(\"" + value + "\",\"" + record.data.cwid + "\")'>删除</a>";
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
//************************************弹出界面***************************************

//************************************主界面*****************************************
Ext.onReady(function () {
    Ext.define('YhView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'usergrid',
                    store: store,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                    }),
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            text: '操作',
                            dataIndex: 'yundan_chaifen_id',
                            width: 120,
                            sortable: false,
                            menuDisabled: true,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='EditFenLiu(\"" + record.data.zhuangchedan_id + "\",\"" + record.data.yundan_id + "\",\"" + record.data.yundan_chaifen_id + "\");'>设置</a>　<a onclick='LookGoods(\"" + record.data.yundan_id + "\");'>货物查看</a>";
                                return str;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yundanNum',
                            sortable: false,
                            menuDisabled: true,
                            width: 140,
                            text: "运单号"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'zhuangchedanNum',
                            sortable: false,
                            menuDisabled: true,
                            width: 140,
                            text: "装车单号"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            text: "司机姓名"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toAddress',
                            sortable: false,
                            menuDisabled: true,
                            text: "运抵地点"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shouhuoPeople',
                            sortable: false,
                            menuDisabled: true,
                            text: "收货人"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shouhuoTel',
                            sortable: false,
                            menuDisabled: true,
                            width: 140,
                            text: "收货电话"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'songhuoType',
                            sortable: false,
                            menuDisabled: true,
                            text: "配送方式",
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                if (value == 0)
                                    return "自提";
                                else
                                    return "送货";
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyYunfei',
                            sortable: false,
                            menuDisabled: true,
                            text: "运费"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyHuiKou',
                            sortable: false,
                            menuDisabled: true,
                            text: "回扣"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'memo',
                            sortable: false,
                            menuDisabled: true,
                            text: "备注"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'ydjshf',
                            sortable: false,
                            menuDisabled: true,
                            text: "已登记送货费"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'ydjzzf',
                            sortable: false,
                            menuDisabled: true,
                            text: "已登记中转费"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yhxshf',
                            sortable: false,
                            menuDisabled: true,
                            text: "已核销送货费"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yhxzzf',
                            sortable: false,
                            menuDisabled: true,
                            text: "已核销中转费"
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
                                    xtype: 'combobox',
                                    id: 'cx_bsc',
                                    width: 160,
                                    fieldLabel: '办事处',
                                    editable: false,
                                    labelWidth: 50,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'mc',
                                    valueField: 'id',
                                    value: ''
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'start_time',
                                    width: 160,
                                    labelWidth: 60,
                                    format: 'Y-m-d',
                                    fieldLabel: '运单时间'
                                },
                                {
                                    xtype: 'label',
                                    text: '~'
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'end_time',
                                    width: 100,
                                    format: 'Y-m-d'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_zcd',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '装车单号'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_ydh',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '运单单号'
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_isfl',
                                    width: 120,
                                    fieldLabel: '是否分流',
                                    editable: false,
                                    labelWidth: 60,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['id', 'mc'],
                                        data: [
                                            { 'id': '0', 'mc': '否' },
                                            { 'id': '1', 'mc': '是' }
                                        ]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'mc',
                                    valueField: 'id',
                                    value: ''
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        if (privilege("财务核销管理_货物分流核销_查询")) {
                                            GetYunDanList(1);
                                        }
                                    }
                                }
                                //{
                                //    xtype: 'button',
                                //    iconCls: 'add',
                                //    text: '批量设置',
                                //    handler: function () {
                                //        //EditFenLiu(1);
                                //    }
                                //}
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: store,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new YhView();

    GetYunDanList(1);

    GetOffice();

    GetCompany();

    GetDriver();
});
//************************************主界面*****************************************