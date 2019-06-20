//-----------------------------------------------------------全局变量-----------------------------------------------------------------
var pageSize = 15;
var tabN = 1;
//-----------------------------------------------------------数据源-------------------------------------------------------------------
//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

var clientStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'clientId' },
        { name: 'people' },
        { name: 'tel' },
        { name: 'sumMoney' },
        { name: 'yhxMoney' },
        { name: 'whxMoney' },
        { name: 'SortByMoney' },
        { name: 'SortByDays' },
        { name: 'limit' },
        { name: 'period' },
        { name: 'sq_people' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getdriverList(nPage);
    }
});

//欠付store
var qfStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyQianfu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        {
            name: 'huidanType'
        },
        { name: 'isSign' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getqfList(nPage);
    }
});

//选中欠付
var selYdStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyQianfu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeId' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        {
            name: 'huidanType'
        },
        { name: 'isSign' },
        { name: 'memo' }
    ],
    data: [
    ]
});

var qf_yhxStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyQianfu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        {
            name: 'huidanType'
        },
        { name: 'isSign' },
        { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getqfList(nPage);
    }
});

var selYdStore2 = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'isbj' },
        { name: 'isxz' },
        { name: 'id' },
        { name: 'yundan_id' },
        { name: 'yundanNum' },
        { name: 'zhuangchedanNum' },
        { name: 'moneyQianfu' },
        { name: 'yhxmoney' },
        { name: 'whxmoney' },
        { name: 'hxje' },
        { name: 'incomeDate' },
        { name: 'officeName' },
        { name: 'fahuoPeople' },
        { name: 'fahuoTel' },
        { name: 'shouhuoPeople' },
        { name: 'shouhuoTel' },
        { name: 'shouhuoAddress' },
        { name: 'ddofficeName' },
        { name: 'songhuoType' },
        { name: 'payType' },
        { name: 'moneyYunfei' },
        { name: 'UserName' },
        {
            name: 'huidanType'
        },
        { name: 'isSign' },
        { name: 'memo' }
    ],
    data: [
    ]
});

var logStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'id' },
    { name: 'income_id' },
    { name: 'incomeDate' },
    { name: 'money' },
    { name: 'memo' },
    { name: 'addtime' },
    { name: 'adduser' },
    { name: 'UserXM' }
    ],
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
//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal) {
        bscStore.add([{ 'officeId': '', 'officeName': '全部' }]);
        bscStore.loadData(retVal, true);

        Ext.getCmp('cx_bsc').setValue('');
    }, CS.onError)
}

function getQfList(nPage) {
    var bscid = Ext.getCmp("cx_bsc").getValue();
    var kssj = Ext.getCmp("start_time").getValue();
    var jssj = Ext.getCmp("end_time").getValue();
    var client = Ext.getCmp("cx_client").getValue();

    CS('CZCLZ.Finance.GetClientQfByPage', function (retVal) {
        clientStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, bscid, kssj, jssj, client);
}

function HX(clientid) {
    var win = new HXWin();
    win.show(null, function () {
        Ext.getCmp('clientId').setValue(clientid);
        if (tabN == 1) {
            getqfList(1);
        } else if (tabN == 2) {
            getqfList2(1);
        }
        
    });
}

//获取欠付运费未核销
function getqfList(nPage) {
    var id = Ext.getCmp('clientId').getValue();
    CS('CZCLZ.Finance.GetQfHx2ClientListByPage', function (retVal) {
        selYdStore.removeAll();
        qfStore.removeAll();
        qfStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, id, 0);
}

//获取欠付运费已核销
function getqfList2(nPage) {
    var id = Ext.getCmp('clientId').getValue();
    CS('CZCLZ.Finance.GetQfHx2ClientListByPage', function (retVal) {
        selYdStore2.removeAll();
        qf_yhxStore.removeAll();
        qf_yhxStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, id, 1);
}

function LookGoods(ydid) {
    var win = new HPWin();
    win.show(null, function () {
        CS('CZCLZ.Finance.GetHPList', function (retVal) {
            HPStore.loadData(retVal);
        }, CS.onError, ydid);
    });
}
//-----------------------------------------------------------货品界面-----------------------------------------------------------------
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

//-----------------------------------------------------------日志界面-----------------------------------------------------------------
Ext.define('LogWin', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 500,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '日志',

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
                        region: 'center',
                        border: true,
                        store: logStore,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'income_id',
                                flex: 1,
                                menuDisabled: true,
                                sortable: false,
                                hidden: true
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'incomeDate',
                                width: 90,
                                format: 'Y-m-d',
                                text: '核销日期',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                width: 130,
                                text: '核销金额',
                                menuDisabled: true,
                                sortable: false

                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'memo',
                                flex: 1,
                                text: '备注',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'UserXM',
                                width: 90,
                                text: '操作人',
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
//-----------------------------------------------------------核销详情弹出框-----------------------------------------------------------------
Ext.define('HXWin', {
    extend: 'Ext.window.Window',

    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '核销设置',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'tabpanel',
                padding: '10 10 10 10',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'panel',
                        itemId: 'tab1',
                        title: '未核销',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                region: 'center',
                                id: 'qfgrid',
                                store: qfStore,
                                border: true,
                                columnLines: true,
                                plugins: [
                                    Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1,//设置单击单元格编辑
                                        listeners: {
                                            'beforeedit': function (editor, c, e) {
                                                Ext.getCmp('qfgrid').getSelectionModel().setLocked(true);
                                            },
                                            'edit': function (editor, c, e) {
                                                Ext.getCmp('qfgrid').getSelectionModel().setLocked(false);
                                                //预存
                                                if (selYdStore.data.length > 0) {
                                                    for (var i = 0; i < selYdStore.data.length; i++) {
                                                        if (selYdStore.data.items[i].data.id == c.record.data.id) {
                                                            selYdStore.data.items[i].data.hxje = c.value;
                                                        }
                                                    }
                                                }
                                                
                                            }
                                        }
                                    })
                                ],
                                selModel: Ext.create('Ext.selection.CheckboxModel', {
                                    selType: 'checkboxmodel',
                                    mode: 'SIMPLE',
                                    checkOnly: true,
                                    listeners: {
                                        deselect: function (model, record, index) {//取消选中时产生的事件
                                            //选择预存
                                            for (var i = 0; i < selYdStore.data.length; i++) {
                                                if (selYdStore.data.items[i].data.id == record.data.id) {
                                                    selYdStore.remove(selYdStore.data.items[i]);
                                                }
                                            }
                                        },
                                        select: function (model, record, index) {//record被选中时产生的事件
                                            //选择预存
                                            var n = 1;
                                            if (selYdStore.data.length > 0) {
                                                for (var i = 0; i < selYdStore.data.length; i++) {
                                                    if (selYdStore.data.items[i].data.id == record.data.id) {
                                                        n--;
                                                        selYdStore.data.items[i].data.hxje = record.data.hxje;
                                                    }
                                                }
                                            }
                                            if (n == 1) {
                                                selYdStore.add(record.data);
                                            }
                                        }
                                    }
                                }),
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        text: '操作',
                                        dataIndex: 'yundan_id',
                                        width: 90,
                                        sortable: false,
                                        menuDisabled: true,
                                        align: "center",
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str;
                                            str = "<a onclick='LookGoods(\"" + value + "\");'>查看货物</a>";
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'yundanNum',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "运单号",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'zhuangchedanNum',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "装车单号",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'moneyQianfu',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "欠付（包括回单付）",
                                        width: 140
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'yhxmoney',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "已核销",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'whxmoney',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "未核销",
                                        width: 90
                                    },
                                    {
                                        header: "本次核销",
                                        width: 100,
                                        sortable: false,
                                        dataIndex: 'hxje',
                                        menuDisabled: true,
                                        xtype: 'numbercolumn',
                                        editor: {
                                            xtype: "numberfield",
                                            allowNegative: false,
                                            selectOnFocus: true
                                        },
                                        align: "center"
                                    },
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'incomeDate',
                                        width: 90,
                                        format: 'Y-m-d',
                                        text: '最新核销时间',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'officeName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "办事处",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'fahuoPeople',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "发货人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'fahuoTel',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "发货电话",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoPeople',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoTel',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货电话",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoAddress',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货地址",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'ddofficeName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "到达站",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'songhuoType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "送货方式",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            if (value == 0) {
                                                return "自提";
                                            } else {
                                                return "送货";
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'payType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "结算方式",
                                        width: 130,
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
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'moneyYunfei',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "运费",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'UserName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "制单人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'huidanType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "回单类型",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str = "";
                                            if (value == "0") {
                                                str = "回单";
                                            } else if (value == "1") {
                                                str = "收条";
                                            }
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'isSign',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "回单状态",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str = "";
                                            if (value == "0") {
                                                str = "否";
                                            } else if (value == "1") {
                                                str = "是";
                                            }
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'memo',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "备注",
                                        width: 90
                                    }
                                ],
                                viewConfig: {

                                },
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        displayInfo: true,
                                        store: qfStore,
                                        dock: 'bottom'
                                    }
                                ]
                            },
                            {
                                xtype: 'panel',
                                region: 'south',
                                layout: {
                                    type: 'column'
                                },
                                height: 60,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        id: 'clientId',
                                        hidden: true
                                    },
                                    {
                                        xtype: 'textfield',
                                        id: 'sz_ss',
                                        width: 160,
                                        labelWidth: 70,
                                        fieldLabel: '实收金额',
                                        columnWidth: 0.2,
                                        padding: '15 0 15 15'
                                    },
                                    {
                                        xtype: 'button',
                                        text: '分摊',
                                        columnWidth: 0.09,
                                        margin: '15 0 0 0 ',
                                        handler: function () {
                                            var ftjg = Ext.getCmp('sz_ss').getValue();//分摊金额
                                            var jfje = ftjg;//金额计费
                                            var grid = Ext.getCmp('qfgrid');
                                            var gx = grid.getSelectionModel().getSelection();
                                            for (var i = 0; i < gx.length; i++) {
                                                var h = grid.getStore().indexOf(gx[i]);
                                                var whx = grid.store.getAt(h).data.whxmoney;
                                                var je = 0;//实际运单核销金额
                                                var id = grid.store.getAt(h).data.id;
                                                if (jfje > 0) {
                                                    if (jfje >= whx) {
                                                        je = whx;
                                                        jfje -= whx;
                                                    } else {
                                                        je = jfje;
                                                        jfje = 0;
                                                    }
                                                }
                                                grid.store.getAt(h).set('hxje', je);

                                                for (var b = 0; b < selYdStore.data.length; b++) {
                                                    if (selYdStore.data.items[b].data.id == id) {
                                                        selYdStore.data.items[b].data.hxje = je;
                                                    }
                                                }
                                            }

                                        }
                                    },
                                    {
                                        xtype: 'datefield',
                                        id: 'sz_hxrq',
                                        width: 160,
                                        labelWidth: 70,
                                        format: 'Y-m-d',
                                        fieldLabel: '核销日期',
                                        columnWidth: 0.3,
                                        padding: '15 15 15 15',
                                        value: new Date()
                                    }
                                ]
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存核销结果',
                                iconCls: "save",
                                handler: function () {
                                    if (privilege("财务应收核销_欠付运费核销_核销")) {
                                        var xzlist = [];
                                        for (var i = 0; i < selYdStore.data.items.length; i++) {
                                            var whx = selYdStore.data.items[i].data.whxmoney;
                                            var hxje = selYdStore.data.items[i].data.hxje;
                                            if (hxje == '0' || hxje == null || hxje == '') {
                                                Ext.Msg.alert('提示', "运单【" + selYdStore.data.items[i].data.yundanNum + "】本次核销金额不能为0或空。");
                                                return;
                                            }
                                            if (whx < hxje) {
                                                Ext.Msg.alert('提示', "运单【" + selYdStore.data.items[i].data.yundanNum + "】本次核销金额大于未核销金额。");
                                                return;
                                            } else {
                                                xzlist.push(selYdStore.data.items[i].data);
                                            }
                                        }
                                        var hxrq = Ext.getCmp('sz_hxrq').getValue();
                                        if (hxrq == '' || hxrq == null) {
                                            Ext.Msg.alert('提示', "日期必填！");
                                            return;
                                        }
                                        if (xzlist.length == 0) {
                                            Ext.Msg.alert('提示', "请先选择数据，再保存！");
                                            return;
                                        }
                                        CS('CZCLZ.Finance.SaveQFYFHx', function (retVal) {
                                            if (retVal) {
                                                Ext.Msg.show({
                                                    title: '提示',
                                                    msg: '保存成功!',
                                                    buttons: Ext.MessageBox.OK,
                                                    icon: Ext.MessageBox.INFO
                                                });
                                                Ext.getCmp('sz_ss').setValue('');
                                                getqfList(1);
                                            }
                                        }, CS.onError, xzlist, hxrq);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        itemId: 'tab2',
                        title: '已核销',
                        layout: {
                            type: 'border'
                        },
                        items: [
                            {
                                xtype: 'gridpanel',
                                region: 'center',
                                id: 'qf_yhxgrid',
                                store: qf_yhxStore,
                                border: true,
                                columnLines: true,
                                selModel: Ext.create('Ext.selection.CheckboxModel', {
                                    selType: 'checkboxmodel',
                                    mode: 'SIMPLE',
                                    checkOnly: true,
                                    listeners: {
                                        deselect: function (model, record, index) {//取消选中时产生的事件
                                            record.data.isxz = 0;

                                            //选择预存
                                            for (var i = 0; i < selYdStore2.data.length; i++) {
                                                if (selYdStore2.data.items[i].data.id == record.data.id) {
                                                    selYdStore2.remove(selYdStore2.data.items[i]);
                                                }
                                            }
                                        },
                                        select: function (model, record, index) {//record被选中时产生的事件
                                            record.data.isxz = 1;

                                            //选择预存
                                            var n = 1;
                                            if (selYdStore2.data.length > 0) {
                                                for (var i = 0; i < selYdStore2.data.length; i++) {
                                                    if (selYdStore2.data.items[i].data.id == record.data.id) {
                                                        n--;
                                                        selYdStore2.data.items[i].data.hxje = record.data.hxje;
                                                    }
                                                }
                                            }
                                            if (n == 1) {
                                                selYdStore2.add(record.data);
                                            }
                                        }
                                    }
                                }),
                                columns: [
                                    {
                                        xtype: 'gridcolumn',
                                        text: '操作',
                                        dataIndex: 'yundan_id',
                                        width: 90,
                                        sortable: false,
                                        menuDisabled: true,
                                        align: "center",
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str;
                                            str = "<a onclick='LookGoods(\"" + value + "\");'>查看货物</a>";
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'yundanNum',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "运单号",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'zhuangchedanNum',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "装车单号",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'moneyQianfu',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "欠付（包括回单付）",
                                        width: 140
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'yhxmoney',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "已核销",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'whxmoney',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "未核销",
                                        width: 90
                                    },
                                    //{
                                    //    header: "本次核销",
                                    //    width: 100,
                                    //    sortable: false,
                                    //    dataIndex: 'hxje',
                                    //    menuDisabled: true,
                                    //    xtype: 'numbercolumn',
                                    //    editor: {
                                    //        xtype: "numberfield",
                                    //        allowNegative: false,
                                    //        selectOnFocus: true
                                    //    },
                                    //    align: "center"
                                    //},
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'incomeDate',
                                        width: 90,
                                        format: 'Y-m-d',
                                        text: '最新核销时间',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'officeName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "办事处",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'fahuoPeople',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "发货人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'fahuoTel',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "发货电话",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoPeople',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoTel',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货电话",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'shouhuoAddress',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "收货地址",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'ddofficeName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "到达站",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'songhuoType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "送货方式",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            if (value == 0) {
                                                return "自提";
                                            } else {
                                                return "送货";
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'payType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "结算方式",
                                        width: 130,
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
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'moneyYunfei',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "运费",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'UserName',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "制单人",
                                        width: 90
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'huidanType',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "回单类型",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str = "";
                                            if (value == "0") {
                                                str = "回单";
                                            } else if (value == "1") {
                                                str = "收条";
                                            }
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'isSign',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "回单状态",
                                        width: 90,
                                        renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                            var str = "";
                                            if (value == "0") {
                                                str = "否";
                                            } else if (value == "1") {
                                                str = "是";
                                            }
                                            return str;
                                        }
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'memo',
                                        sortable: false,
                                        menuDisabled: true,
                                        text: "备注",
                                        width: 90
                                    }
                                ],
                                viewConfig: {

                                },
                                dockedItems: [
                                    {
                                        xtype: 'pagingtoolbar',
                                        displayInfo: true,
                                        store: qf_yhxStore,
                                        dock: 'bottom'
                                    }
                                ]
                            }
                        ]
                    }
                ],
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
                                        xtype: "button",
                                        text: "选中运单",
                                        iconCls: "add",
                                        arrowAlign: "right",
                                        menu: [
                                            {
                                                text: "导出excel",
                                                handler: function () {
                                                    if (privilege("财务应收核销_欠付运费核销_导出")) {
                                                        var xzlist = [];
                                                        if (tabN == 1) {
                                                            var sel = Ext.getCmp('qfgrid').getSelectionModel().getSelection();
                                                            if (sel.length == 0) {
                                                                Ext.Msg.alert('提示', "请选择导出记录。");
                                                                return;
                                                            }
                                                            for (var i = 0; i < sel.length; i++) {
                                                                xzlist.push(sel[i].data);
                                                            }
                                                        } else if (tabN == 2) {
                                                            var sel = Ext.getCmp('qf_yhxgrid').getSelectionModel().getSelection();
                                                            if (sel.length == 0) {
                                                                Ext.Msg.alert('提示', "请选择导出记录。");
                                                                return;
                                                            }
                                                            for (var i = 0; i < sel.length; i++) {
                                                                xzlist.push(sel[i].data);
                                                            }
                                                        }
                                                        DownloadFile("CZCLZ.Finance.DownLoadQfyf", "导出欠付运费核销.xls", xzlist);
                                                    }
                                                }
                                            },
                                            {
                                                text: "核销日志",
                                                handler: function () {
                                                    if (tabN == 1) {
                                                        if (selYdStore.data.items.length != 1) {
                                                            Ext.Msg.alert('提示', "请单个选择查询。");
                                                            return;
                                                        }
                                                    } else if (tabN == 2) {
                                                        if (selYdStore2.data.items.length != 1) {
                                                            Ext.Msg.alert('提示', "请单个选择查询。");
                                                            return;
                                                        }
                                                    }
                                                    var win = new LogWin();
                                                    win.show(null, function () {
                                                        var id = '';
                                                        if (tabN == 1) {
                                                            id = selYdStore.data.items[0].data.id;
                                                        } else if (tabN == 2) {
                                                            id = selYdStore2.data.items[0].data.id;
                                                        }
                                                        CS('CZCLZ.Finance.GetHxLog', function (retVal) {
                                                            logStore.loadData(retVal);
                                                        }, CS.onError, id);
                                                    });
                                                }
                                            },
                                            {
                                                text: "清除核销",
                                                handler: function () {
                                                    Ext.MessageBox.confirm('确认', '取消核销将删除所有的核销收款记录,确认吗?', function (btn) {
                                                        if (btn == 'yes') {
                                                            if (tabN == 1) {
                                                                for (var i = 0; i < selYdStore.data.items.length; i++) {
                                                                    var id = selYdStore.data.items[i].data.id;
                                                                    var je = selYdStore.data.items[i].data.yhxmoney;
                                                                    var ydid = selYdStore.data.items[i].data.yundan_id;
                                                                    CS('CZCLZ.Finance.DeleteIncomeHxLog', function (retVal) {
                                                                        getqfList(1);
                                                                    }, CS.onError, "2", id, ydid, je);
                                                                }
                                                            } else if (tabN == 2) {
                                                                for (var i = 0; i < selYdStore2.data.items.length; i++) {
                                                                    var id = selYdStore2.data.items[i].data.id;
                                                                    var je = selYdStore2.data.items[i].data.yhxmoney;
                                                                    var ydid = selYdStore2.data.items[i].data.yundan_id;
                                                                    CS('CZCLZ.Finance.DeleteIncomeHxLog', function (retVal) {
                                                                        getqfList2(1);
                                                                    }, CS.onError, "2", id, ydid, je);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                listeners: {
                    'tabchange': function (t, n) {
                        if (n.itemId == 'tab1') {
                            tabN = 1;
                            getqfList(1);
                        } else if (n.itemId == 'tab2') {
                            tabN = 2;
                            getqfList2(1);
                        }
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});
//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.define('MainView', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'gridpanel',
                    border: 1,
                    columnLines: 1,
                    store: clientStore,
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '客户名'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'tel',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '电话'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sumMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '总欠付'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yhxMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '已核销'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'whxMoney',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '未核销'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'SortByMoney',
                            flex: 1,
                            text: '超过金额'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'SortByDays',
                            flex: 1,
                            text: '超过天数'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'limit',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '授权额度'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'period',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '授权等级'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sq_people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '授权人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'clientId',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '操作',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='HX(\"" + value + "\");'>核销</a>";
                                return str;
                            }
                        }
                    ],
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
                                    displayField: 'officeName',
                                    valueField: 'officeId'
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
                                    id: 'cx_client',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '客户姓名'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        if (privilege("财务应收核销_欠付运费核销_查询")) {
                                            getQfList(1);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: clientStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }
});

Ext.onReady(function () {
    new MainView();
    GetBsc();
});

