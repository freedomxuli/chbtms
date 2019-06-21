var pageSize = 15;
var page = 1;


var bscStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'officeId' },
       { name: 'officeName' }
    ]
});

var bscStore2 = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'officeId' },
       { name: 'officeName' }
    ]
});

var itemStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'itemName' }
    ]
});

var itemStore2 = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'itemName' }
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
        page = nPage;
        searchExpense(nPage);
    }
});

function searchExpense(nPage) {
    var offid = Ext.getCmp('cx_bsc').getValue();
    var itemid = Ext.getCmp('cx_item').getValue();
    var st = Ext.getCmp('start_time').getValue();
    var ed = Ext.getCmp('end_time').getValue();
    CS('CZCLZ.Cwdj.GetExpenseByPage', function (retVal) {
        fkStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, offid, itemid, st, ed);
}

function edit(id) {
    if (privilege("财务登记管理_费用登记_修改删除")) {
        var win = new addWin({ ID: id });
        win.show(null, function () {
            MCS(
                function (ret) {
                    var retVal = ret[0].retVal;
                    bscStore.loadData(retVal);
                    var retVal2 = ret[1].retVal;
                    itemStore.loadData(retVal2);
                    var retVal3 = ret[2].retVal[0];
                    var form = Ext.getCmp('addform');
                    form.form.setValues(retVal3);

                }, CS.onError,
                {
                    ctx: 'CZCLZ.BscMag.GetBsc2', args: []
                }
                ,
                {
                    ctx: 'CZCLZ.SFKMag.GetAllFkxm', args: []
                }
                ,
                {
                    ctx: 'CZCLZ.Cwdj.GetExpenseByID', args: [id]
                }
            );
        });
    }
}

function del(id) {
    if (privilege("财务登记管理_费用登记_修改删除")) {
        Ext.MessageBox.confirm("提示", "是否删除?", function (obj) {
            if (obj == "yes") {
                CS('CZCLZ.Cwdj.DelExpense', function (retVal) {
                    searchExpense(page);
                }, CS.onError, id);
            }
            else {
                return;
            }
        });
    }
}


function save(id) {

}

Ext.define('addWin', {
    extend: 'Ext.window.Window',

    height: 382,
    width: 578,
    layout: {
        type: 'fit'
    },
    title: '费用登记',
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
                            id: 'addform',
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
                                    id: 'officeId',
                                    name: 'officeId',
                                    columnWidth: 1,
                                    fieldLabel: '办事处',
                                    editable: false,
                                    labelWidth: 60,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'officeName',
                                    valueField: 'officeId',
                                    padding: 10
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'expenseDate',
                                    name: 'expenseDate',
                                    columnWidth: 1,
                                    labelWidth: 60,
                                    format: 'Y-m-d',
                                    padding: 10,
                                    fieldLabel: '登记日期'
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'itemId',
                                    name: 'itemId',
                                    columnWidth: 1,
                                    fieldLabel: '费用科目',
                                    editable: false,
                                    labelWidth: 60,
                                    store: itemStore,
                                    queryMode: 'local',
                                    displayField: 'itemName',
                                    valueField: 'id',
                                    padding: 10
                                },
                                {
                                    xtype: 'numberfield',
                                    id: 'money',
                                    name: 'money',
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
                                    id: 'memo',
                                    name: 'memo',
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
                                var form = Ext.getCmp('addform');
                                if (form.form.isValid()) {
                                    var values = form.form.getValues(false);
                                    var aID = me.ID;
                                    CS('CZCLZ.Cwdj.AddExpense', function (ret) {
                                        if (ret) {
                                            Ext.Msg.show({
                                                title: '提示',
                                                msg: '保存成功!',
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO,
                                                fn: function () {
                                                    searchExpense(page);
                                                    me.close();
                                                }
                                            });
                                        }

                                    }, CS.onError, aID, values);
                                }
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
                                text: '操作',
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    return "<a href='JavaScript:void(0)' onclick='edit(\"" + value + "\")'>修改</a>  <a href='JavaScript:void(0)' onclick='del(\"" + value + "\")'>删除</a>";
                                }
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
                                text: '收款日期'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'itemName',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '收款科目'
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'money',
                                sortable: false,
                                menuDisabled: true,
                                flex: 1,
                                text: '收款金额'
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
                                        store: bscStore2,
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
                                        fieldLabel: '费用时间'
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
                                        fieldLabel: '费用科目',
                                        editable: false,
                                        labelWidth: 60,
                                        queryMode: 'local',
                                        valueField: 'id',
                                        displayField: 'itemName',
                                        store: itemStore2
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'search',
                                        text: '查询',
                                        handler: function () {
                                            if (privilege("财务登记管理_费用登记_查询")) {
                                                searchExpense(page);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'add',
                                        text: '新增项目',
                                        handler: function () {
                                            if (privilege("财务登记管理_费用登记_登记")) {
                                                var win = new addWin({ ID: '' });
                                                win.show(null, function () {
                                                    MCS(
                                                        function (ret) {
                                                            var retVal = ret[0].retVal;
                                                            bscStore.loadData(retVal);
                                                            var retVal2 = ret[1].retVal;
                                                            itemStore.loadData(retVal2);

                                                        }, CS.onError,
                                                        {
                                                            ctx: 'CZCLZ.BscMag.GetBsc2', args: []
                                                        }
                                                        ,
                                                        {
                                                            ctx: 'CZCLZ.SFKMag.GetAllFkxm', args: []
                                                        }
                                                    );
                                                });
                                            }
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
    InlineCS('CZCLZ.SFKMag.GetAllFkxm', function (retVal) {
        itemStore2.add({ 'id': '', 'itemName': '费用科目' });
        itemStore2.loadData(retVal, true);
        Ext.getCmp('cx_item').setValue('');
    }, CS.onError);
    InlineCS('CZCLZ.BscMag.GetBsc2', function (retVal) {
        bscStore2.add({ 'officeId': '', 'officeName': '办事处' });
        bscStore2.loadData(retVal, true);
        Ext.getCmp('cx_bsc').setValue('');
    }, CS.onError);
    searchExpense(1);
});
