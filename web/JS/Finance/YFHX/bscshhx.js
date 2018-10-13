var pageSize = 15;

var bscStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'mc' }
    ]
});

var driverStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'driverId' },
       { name: 'people' },
       { name: 'tel' },
       { name: 'carNum' },
       { name: 'allMoney' },
       { name: 'HeXiaoMoney' },
       { name: 'WeiHeXiaoMoney' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getdriverList(nPage);
    }
});

var yfStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_id' },
       { name: 'yundanNum' },
       { name: 'zhuangchedanNum' },
       { name: 'daiShouKuan' },
       { name: 'yhxmoney' },
       { name: 'whxmoney' },
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
       { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getyfList(nPage);
    }
});

Ext.define('HXWin', {
    extend: 'Ext.window.Window',

    height: 453,
    width: 900,
    layout: {
        type: 'fit'
    },
    title: '核销列表',
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            title: '未核稿',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    id: 'yfgrid',
                                    store: yfStore,
                                    border: true,
                                    columnLines: true,
                                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                                    }),
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer'),
                                        {
                                            xtype: 'gridcolumn',
                                            text: '操作',
                                            dataIndex: 'yundan_id',
                                            width: 120,
                                            sortable: false,
                                            menuDisabled: true,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str;
                                                str = "<a onclick='GetYJ(\"" + value + "\");'>核销金额</a>　<a onclick='PostYJ(\"" + value + "\");'>查看货物</a>";
                                                return str;
                                            }
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundanNum',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "运单号"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'zhuangchedanNum',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "装车单号"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'daiShouKuan',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "代收货款"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yhxmoney',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "已核销"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'whxmoney',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "未核销"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'incomeDate',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "最新核销时间"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'officeName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "办事处"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fahuoPeople',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "发货人"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fahuoTel',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "发货电话"
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
                                            text: "收货电话"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'shouhuoAddress',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "收货地址"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'ddofficeName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "到达站"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'songhuoType',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "送货方式"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'payType',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "结算方式"
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
                                            dataIndex: 'UserName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "制单人"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'memo',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "备注"
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
                                                    id: 'cx_people',
                                                    width: 160,
                                                    labelWidth: 60,
                                                    fieldLabel: '发货人'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'cx_yundannum',
                                                    width: 160,
                                                    labelWidth: 60,
                                                    fieldLabel: '运单编号'
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'search',
                                                    text: '查询',
                                                    handler: function () {

                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '设置',
                                                    handler: function () {
                                                        SingleWin();
                                                        //PostYJWin();
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'pagingtoolbar',
                                            displayInfo: true,
                                            store: yfStore,
                                            dock: 'bottom'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            title: '已核稿',
                            items: [
                                {
                                    xtype: 'gridpanel',
                                    id: 'wfgrid',
                                    store: yfStore,
                                    border: true,
                                    columnLines: true,
                                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                                    }),
                                    columns: [
                                        Ext.create('Ext.grid.RowNumberer'),
                                        {
                                            xtype: 'gridcolumn',
                                            text: '操作',
                                            dataIndex: 'yundan_id',
                                            width: 120,
                                            sortable: false,
                                            menuDisabled: true,
                                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                var str;
                                                str = "<a onclick='GetYJ(\"" + value + "\");'>核销金额</a>　<a onclick='PostYJ(\"" + value + "\");'>查看货物</a>";
                                                return str;
                                            }
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yundanNum',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "运单号"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'zhuangchedanNum',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "装车单号"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'daiShouKuan',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "代收货款"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'yhxmoney',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "已核销"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'whxmoney',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "未核销"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'incomeDate',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "最新核销时间"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'officeName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "办事处"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fahuoPeople',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "发货人"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fahuoTel',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "发货电话"
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
                                            text: "收货电话"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'shouhuoAddress',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "收货地址"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'ddofficeName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "到达站"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'songhuoType',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "送货方式"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'payType',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "结算方式"
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
                                            dataIndex: 'UserName',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "制单人"
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'memo',
                                            sortable: false,
                                            menuDisabled: true,
                                            text: "备注"
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
                                                    id: 'cx_people_whg',
                                                    width: 160,
                                                    labelWidth: 60,
                                                    fieldLabel: '发货人'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'cx_yundannum_whg',
                                                    width: 160,
                                                    labelWidth: 60,
                                                    fieldLabel: '运单编号'
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'search',
                                                    text: '查询',
                                                    handler: function () {

                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'add',
                                                    text: '设置',
                                                    handler: function () {
                                                        SingleWin();
                                                        //PostYJWin();
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'pagingtoolbar',
                                            displayInfo: true,
                                            store: yfStore,
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

Ext.define('SingleHXWin', {
    extend: 'Ext.window.Window',

    height: 650,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '预付核销',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                layout: {
                    type: 'anchor'
                },
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'column'
                        },
                        items: [
                            {
                                xtype: 'datefield',
                                fieldLabel: '登记日期',
                                id: 'hxDate',
                                format: 'Y-m-d',
                                padding: '10 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: '核销金额（元）',
                                id: 'hxmoney',
                                minValue: 0,
                                padding: '0 10 10 10',
                                columnWidth: 1
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '备注',
                                id: 'hxmemo',
                                padding: '0 10 10 10',
                                columnWidth: 1
                            }
                        ],
                        buttonAlign: 'center',
                        buttons: [
                            {
                                text: '保存',
                                handler: function () {

                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        border: true,
                        columnLines: true,
                        columns: [
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'expenseDate',
                                flex: 1,
                                text: '登记时间',
                                format: 'Y-m-d',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                flex: 1,
                                text: '核销金额（元）',
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
                            }
                        ]
                    }
                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        iconCls: 'dropyes',
                        handler: function () {

                        }
                    },
                     {
                         text: '取消',
                         iconCls: 'back',
                         handler: function () {
                             me.close();
                         }
                     }
                ]
            }
        ];
        me.callParent(arguments);
    }
});

Ext.onReady(function () {
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
                        store: driverStore,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'people',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '司机名'
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
                                dataIndex: 'carNum',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '车牌号'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'allMoney',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '总计金额（元）'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'HeXiaoMoney',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '已核销金额（元）'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'WeiHeXiaoMoney',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '未核销金额（元）'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'driverId',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '操作'
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
                                        id: 'cx_driver',
                                        width: 160,
                                        labelWidth: 60,
                                        fieldLabel: '司机姓名'
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'search',
                                        text: '查询',
                                        handler: function () {
                                            var win = new HXWin();
                                            win.show(null, function () {

                                            });
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'pagingtoolbar',
                                dock: 'bottom',
                                width: 360,
                                displayInfo: true
                            }
                        ]
                    }
                ]
            });

            me.callParent(arguments);
        }

    });

    new MainView();
});

function getdriverList(nPage) {

}

function SingleWin() {
    var win = new SingleHXWin();
    win.show(null, function () {

    });
}

