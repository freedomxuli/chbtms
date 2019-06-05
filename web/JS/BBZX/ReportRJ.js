//-----------------------------------------------------------全局变量-----------------------------------------------------------------
//-----------------------------------------------------------数据源-------------------------------------------------------------------
var rjStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'dateFasheng' },
        { name: 'officeName' },
        { name: 'yundanId' },
        { name: 'yundanNum' },
        { name: 'clientId' },
        { name: 'clientName' },
        { name: 'zhuangchedanId' },
        { name: 'zhuangchedanNum' },
        { name: 'driverId' },
        { name: 'driverName' },
        { name: 'incomeItemId' },
        { name: 'expenseItemId' },
        { name: 'itemName' },
        { name: 'moneyIncome' },
        { name: 'moneyExpense' },
        { name: 'memo' },
        { name: 'userName' },
        { name: 'moneyFasheng' }
    ]
});

var yfStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'val' },
        { name: 'text' }
    ],
    data: [
        { 'val': '', 'text': '月份' },
        { 'val': '0', 'text': '1月' },
        { 'val': '1', 'text': '2月' },
        { 'val': '2', 'text': '3月' },
        { 'val': '3', 'text': '4月' },
        { 'val': '4', 'text': '5月' },
        { 'val': '5', 'text': '6月' },
        { 'val': '6', 'text': '7月' },
        { 'val': '7', 'text': '8月' },
        { 'val': '8', 'text': '9月' },
        { 'val': '9', 'text': '10月' },
        { 'val': '10', 'text': '11月' },
        { 'val': '11', 'text': '12月' }
    ]
});

//办事处store
var bscStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'officeId' },
        { name: 'officeName' }
    ]
});

var itemStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'itemId' },
        { name: 'itemName' }
    ],
    data: [
        { 'itemId': '', 'itemName': '收支科目' },
        { 'itemId': '1', 'itemName': '运费现付' },
        { 'itemId': '2', 'itemName': '运费欠付' },
        { 'itemId': '3', 'itemName': '运费到付' },
        { 'itemId': '4', 'itemName': '回扣' },
        { 'itemId': '5', 'itemName': '短驳费' },
        { 'itemId': '6', 'itemName': '送货费' },
        { 'itemId': '7', 'itemName': '中转费' },
        { 'itemId': '8', 'itemName': '代收货款(点上收)' },
        { 'itemId': '9', 'itemName': '代收货款(总部支)' },
        { 'itemId': '10', 'itemName': '代收货款手续费' },
        { 'itemId': '21', 'itemName': '司机运费现付' },
        { 'itemId': '22', 'itemName': '司机运费欠付' },
        { 'itemId': '23', 'itemName': '司机运费到付' },
        { 'itemId': '24', 'itemName': '主货到付(收)' },
        { 'itemId': '25', 'itemName': '主货到付(支)' },
        { 'itemId': '28', 'itemName': '司机押金(收)' },
        { 'itemId': '29', 'itemName': '司机押金(支)' },
        { 'itemId': '100', 'itemName': '费用收入' },
        { 'itemId': '200', 'itemName': '费用支出' }
    ]
});

//-----------------------------------------------------------页面方法-----------------------------------------------------------------
//获取办事处
function GetBsc() {
    CS('CZCLZ.BscMag.GetBsc2', function (retVal1) {
        bscStore.add({ 'officeId': '', 'officeName': '办事处' });
        bscStore.loadData(retVal1, true);
        Ext.getCmp('cx_bsc').setValue('');
    }, CS.onError)
}

function getRjList() {
    var start_time = Ext.getCmp("start_time").getValue();
    var end_time = Ext.getCmp("end_time").getValue();
    var cx_bsc = Ext.getCmp("cx_bsc").getValue();
    var cx_item = Ext.getCmp("cx_item").getValue();
    var cx_memo = Ext.getCmp("cx_memo").getValue();

    CS('CZCLZ.Finance.GetReportRijiList', function (retVal) {
        if (retVal) {
            rjStore.loadData(retVal);
        }
    }, CS.onError, start_time, end_time, cx_bsc, cx_item, cx_memo);
}
//-----------------------------------------------------------界    面-----------------------------------------------------------------
Ext.QuickTips.init();
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
                    store: rjStore,
                    columns: [
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'dateFasheng',
                            width: 90,
                            format: 'Y-m-d',
                            text: '日期',
                            menuDisabled: true,
                            sortable: false,
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return "合计";
                            },
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                if (rowIndex == 0) {
                                    return "期初";
                                } else {
                                    var date = new Date(value);
                                    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                                }
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'officeName',
                            width: 90,
                            text: '办事处',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yundanNum',
                            width: 100,
                            text: '运单编号',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'clientName',
                            width: 120,
                            text: '客户',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'zhuangchedanNum',
                            width: 120,
                            text: '合同编号',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'driverName',
                            width: 90,
                            text: '司机',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'itemName',
                            flex: 1,
                            text: '科目',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyIncome',
                            width: 130,
                            text: '收入',
                            menuDisabled: true,
                            sortable: false,
                            align: 'right',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyExpense',
                            width: 130,
                            text: '支出',
                            menuDisabled: true,
                            sortable: false,
                            align: 'right',
                            summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'memo',
                            width: 100,
                            text: '备注',
                            menuDisabled: true,
                            sortable: false,
                            renderer: function (value, metaData, record, colIndex, store, view) {
                                metaData.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'userName',
                            width: 90,
                            text: '操作人',
                            align: 'center',
                            menuDisabled: true,
                            sortable: false
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyFasheng',
                            width: 150,
                            text: '余额',
                            menuDisabled: true,
                            sortable: false,
                            align: 'right',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                var moneyIncome = dataIndex.data.moneyIncome;
                                var moneyExpense = dataIndex.data.moneyExpense;
                                return (moneyIncome + moneyExpense);//.toStdString(false)
                            }
                        }
                    ],
                    features: [
                        {
                            ftype: 'summary'
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'combobox',
                                    id: 'cx_yf',
                                    width: 80,
                                    hideLabel: true,
                                    editable: false,
                                    store: yfStore,
                                    queryMode: 'local',
                                    displayField: 'text',
                                    valueField: 'val',
                                    value: '',
                                    listeners: {
                                        select: function (combo, records, eOpts) {
                                            var yNum = Number(combo.value);
                                            var oldSt = Ext.getCmp('start_time').getValue();
                                            var oldEnd = Ext.getCmp('end_time').getValue();
                                            var newSt = new Date(oldSt.getFullYear(), yNum, oldSt.getDate());
                                            var newEnd = new Date(oldEnd.getFullYear(), yNum, oldEnd.getDate());
                                            Ext.getCmp('start_time').setValue(newSt);
                                            Ext.getCmp('end_time').setValue(newEnd);
                                        }
                                    }
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'start_time',
                                    width: 100,
                                    hideLabel: true,
                                    format: 'Y-m-d',
                                    value: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                                },
                                {
                                    xtype: 'label',
                                    text: '~'
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'end_time',
                                    width: 100,
                                    hideLabel: true,
                                    format: 'Y-m-d',
                                    value: new Date()
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_bsc',
                                    width: 160,
                                    hideLabel: true,
                                    editable: false,
                                    store: bscStore,
                                    queryMode: 'local',
                                    displayField: 'officeName',
                                    valueField: 'officeId'
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_item',
                                    width: 130,
                                    hideLabel: true,
                                    editable: false,
                                    queryMode: 'local',
                                    valueField: 'itemId',
                                    displayField: 'itemName',
                                    store: itemStore,
                                    value: ''
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_memo',
                                    width: 160,
                                    labelWidth: 60,
                                    fieldLabel: '备注'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'search',
                                    text: '查询',
                                    handler: function () {
                                        getRjList();
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
    new MainView();
    GetBsc();
    getRjList();
});
