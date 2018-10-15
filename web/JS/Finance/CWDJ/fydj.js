var pageSize = 15;

var bscStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'mc' }
    ]
});

var itemStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'mc' }
    ]
});

var fkStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'id' },
       { name: 'officeName' },
       { name: 'expenseDate' },
       { name: 'itemName' },
       { name: 'money' },
       { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getFKList(nPage);
    }
});

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 382,
    width: 578,
    layout: {
        type: 'fit'
    },
    title: '编辑付款项目',
    modal: true,

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        align: 'center',
                        type: 'vbox'
                    },
                    items: [
                        {
                            xtype: 'form',
                            flex: 1,
                            width: 410,
                            layout: {
                                type: 'column'
                            },
                            bodyPadding: 10,
                            border: 0,
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'add_officeId',
                                    columnWidth: 1,
                                    fieldLabel: '办事处',
                                    editable: false,
                                    labelWidth: 60,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'mc',
                                    valueField: 'id',
                                    padding: 10,
                                    value: ''
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'add_incomeDate',
                                    columnWidth: 1,
                                    labelWidth: 60,
                                    format: 'Y-m-d',
                                    padding: 10,
                                    fieldLabel: '收款时间'
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'add_itemId',
                                    columnWidth: 1,
                                    fieldLabel: '收款科目',
                                    editable: false,
                                    labelWidth: 60,
                                    store: itemStore,
                                    queryMode: 'local',
                                    displayField: 'mc',
                                    valueField: 'id',
                                    padding: 10
                                },
                                {
                                    xtype: 'numberfield',
                                    id: 'add_money',
                                    columnWidth: 1,
                                    labelWidth: 60,
                                    padding: 10,
                                    minValue: 1,
                                    allowDecimals: true,
                                    decimalPrecision: 2,
                                    fieldLabel: '金额'
                                },
                                {
                                    xtype: 'textareafield',
                                    id: 'add_memo',
                                    columnWidth: 1,
                                    labelWidth: 60,
                                    padding: 10,
                                    fieldLabel: '备注'
                                }
                            ]
                        }
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: '保存',
                            handler: function () {
                                me.close();
                            }
                        },
                        {
                            text: '取消',
                            handler: function () {
                                me.close();
                            }
                        }
                    ]
                }
            ]
        });

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
                        store: fkStore,
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'id',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '操作'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '办事处'
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'expenseDate',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                format: 'Y-m-d',
                                text: '付款日期'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'itemName',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '付款科目'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '付款金额'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'memo',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '备注'
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
                                        xtype: 'combobox',
                                        id: 'cx_item',
                                        width: 160,
                                        fieldLabel: '付款科目',
                                        editable: false,
                                        labelWidth: 60,
                                        store: itemStore,
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
                                            var win = new addWin();
                                            win.show(null, function () {

                                            });
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'add',
                                        text: '新增项目',
                                        handler: function () {
                                            var win = new addWin();
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
                                store: fkStore,
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

function getFKList(nPage) {

}

