var pageSize = 15;

//************************************数据源*****************************************
var store = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'UserID' },
       { name: 'UserName' },
       { name: 'Password' },
       { name: 'roleId' },
       { name: 'roleName' },
       { name: 'UserXM' },
       { name: 'UserTel' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        getUser(nPage);
    }
});


var bscStore = Ext.create('Ext.data.Store', {
    fields: [
       { name: 'id' },
       { name: 'mc' }
    ]
});

//************************************数据源*****************************************

//************************************页面方法***************************************
function getUser(nPage) {
    //CS('CZCLZ.YHGLClass.GetUserList', function (retVal) {
    //    store.setData({
    //        data: retVal.dt,
    //        pageSize: pageSize,
    //        total: retVal.ac,
    //        currentPage: retVal.cp
    //    });
    //}, CS.onError, nPage, pageSize, Ext.getCmp("cx_role").getValue(), Ext.getCmp("cx_yhm").getValue(), Ext.getCmp("cx_xm").getValue());
}

function EditFenLiu(id) {
    //var win = new FenLiuWin();
    //win.show(null, function () {
        
    //});

    //var win = new PLFenLinWin();
    //win.show(null, function () {

    //});
}
//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('FenLiuWin', {
    extend: 'Ext.window.Window',

    height: 650,
    width: 800,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '分流设置',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'tabpanel',
                layout: {
                    type: 'fit'
                },
                items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'anchor'
                        },
                        title: '中转费',
                        items: [
                            {
                                xtype: 'panel',
                                layout: {
                                    type: 'column'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '中转公司',
                                        id: 'compName',
                                        padding:'10 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: '中转日期',
                                        id: 'actionDate',
                                        format: 'Y-m-d',
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '中转金额',
                                        id: 'money',
                                        minValue: 0,
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '备注',
                                        id: 'memo',
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        text: '保存',
                                        handler: function () {
                                            alert(1);
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
                                        xtype: 'gridcolumn',
                                        dataIndex: 'compName',
                                        flex: 1,
                                        text: '中转公司',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'people',
                                        flex: 1,
                                        text: '联系人',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'tel',
                                        flex: 1,
                                        text: '电话',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'zzDate',
                                        flex: 1,
                                        text: '中转时间',
                                        format:'Y-m-d',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'money',
                                        flex: 1,
                                        text: '中转费（元）',
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
                        ]
                    },
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'anchor'
                        },
                        title: '送货费',
                        items: [
                            {
                                xtype: 'panel',
                                layout: {
                                    type: 'column'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '司机',
                                        id: 'people',
                                        padding: '10 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: '送货日期',
                                        id: 'shDate',
                                        format: 'Y-m-d',
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'numberfield',
                                        fieldLabel: '送货金额',
                                        id: 'shmoney',
                                        minValue: 0,
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '备注',
                                        id: 'shmemo',
                                        padding: '0 10 10 10',
                                        columnWidth: 1
                                    }
                                ],
                                buttonAlign: 'center',
                                buttons: [
                                    {
                                        text: '保存',
                                        handler: function () {
                                            alert(1);
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
                                        xtype: 'gridcolumn',
                                        dataIndex: 'people',
                                        flex: 1,
                                        text: '司机姓名',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'tel',
                                        flex: 1,
                                        text: '电话',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'carNum',
                                        flex: 1,
                                        text: '车牌',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'datecolumn',
                                        dataIndex: 'shDate',
                                        flex: 1,
                                        text: '送货时间',
                                        format: 'Y-m-d',
                                        menuDisabled: true,
                                        sortable: false
                                    },
                                    {
                                        xtype: 'gridcolumn',
                                        dataIndex: 'money',
                                        flex: 1,
                                        text: '送货费（元）',
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
                    title: '',
                    store: store,
                    columnLines: true,
                    selModel: Ext.create('Ext.selection.CheckboxModel', {

                    }),
                    columns: [
                        Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            text: '操作',
                            dataIndex: 'zhuangchedan_id',
                            width: 60,
                            sortable: false,
                            menuDisabled: true,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='EditFenLiu(\"" + value + "\");'>设置</a>";
                                return str;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            text: '货物查看',
                            dataIndex: 'yundan_id',
                            width: 80,
                            sortable: false,
                            menuDisabled: true,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str;
                                str = "<a onclick='EditZhuangCheDan(\"" + value + "\");'>查看</a>";
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
                            text: "收货电话"
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'songhuoType',
                            sortable: false,
                            menuDisabled: true,
                            text: "配送方式"
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
                            dataIndex: 'moneyFenliu',
                            sortable: false,
                            menuDisabled: true,
                            text: "分流费"
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
                                    format:'Y-m-d',
                                    fieldLabel: '运单时间'
                                },
                                {
                                    xtype: 'label',
                                    text:'~'
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
                                            { 'id': '0', 'mc':'否' },
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
                                                
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'add',
                                    text: '批量设置',
                                    handler: function () {
                                        EditFenLiu(1);
                                    }
                                }
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


})
//************************************主界面*****************************************