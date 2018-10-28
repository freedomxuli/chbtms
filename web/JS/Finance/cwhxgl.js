var pageSize = 15;

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

function GetOffice()
{
    CS('CZCLZ.Finance.GetOfficeList', function (retVal) {
        if (retVal)
        {
            bscStore.loadData(retVal);
        }
    },CS.onError);
}

function GetCompany()
{
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

function EditFenLiu(id) {
    var win = new FenLiuWin();
    win.show(null, function () {
        
    });

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
                                        xtype: 'combobox',
                                        id: 'compName',
                                        columnWidth: 1,
                                        fieldLabel: '中转公司',
                                        editable: false,
                                        store: compStore,
                                        queryMode: 'local',
                                        displayField: 'mc',
                                        valueField: 'id',
                                        value: '',
                                        fieldLabel: '中转公司',
                                        padding: '10 10 10 10'
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
                                        iconCls: 'book',
                                        handler: function () {
                                            CS('CZCLZ.Finance.SaveZZData', function (retVal) {
                                                if (retVal)
                                                {

                                                }
                                            }, CS.onError, Ext.getCmp("compName").getValue(), Ext.getCmp("actionDate").getValue(), Ext.getCmp("money").getValue(), Ext.getCmp("memo").getValue());
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
                                        xtype: 'combobox',
                                        id: 'people',
                                        columnWidth: 1,
                                        fieldLabel: '司机',
                                        editable: false,
                                        store: driverStore,
                                        queryMode: 'local',
                                        displayField: 'mc',
                                        valueField: 'id',
                                        value: '',
                                        padding: '10 10 10 10'
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
                                        iconCls:'book',
                                        handler: function () {
                                            CS('CZCLZ.Finance.SaveSHData', function (retVal) {
                                                if (retVal) {

                                                }
                                            }, CS.onError, Ext.getCmp("compName").getValue(), Ext.getCmp("actionDate").getValue(), Ext.getCmp("money").getValue(), Ext.getCmp("memo").getValue());
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
                                str = "<a onclick='EditFenLiu(\"" + value + "\");'>设置</a>　<a onclick='EditZhuangCheDan(\"" + value + "\");'>货物查看</a>";
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
                                        GetYunDanList(1);
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