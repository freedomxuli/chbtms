var pageSize = 20;
//************************************数据源*****************************************
var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_id' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'yundanNum' },
       { name: 'fahuoPeople' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoAddress' },
       { name: 'toAddress' },
       { name: 'songhuoType' },
       { name: 'payType' },
       { name: 'moneyYunfei' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
});


function BindData(nPage) {
    CS('CZCLZ.YDMag.GetYDList', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_keyword").getValue());
}
//************************************数据源*****************************************

//************************************页面方法***************************************

function del(id) {
    Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.YDMag.DeleteYD', function (retVal) {
                if (retVal) {
                    BindData(1);
                }
            }, CS.onError, id);
        }
        else {
            return;
        }
    });
}
function Edit(id) {
    FrameStack.pushFrame({
        url: "EditYD.html?ydid=" + id,
        onClose: function () {
            BindData(1);
        }
    });
}
//************************************页面方法***************************************

//************************************弹出界面***************************************

//************************************弹出界面***************************************

//************************************主界面*****************************************
Ext.onReady(function () {
    Ext.define('YDView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'YDGrid',
                    store: YDStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yundanNum',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '运单号'
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
                            xtype: 'gridcolumn',
                            dataIndex: 'fahuoPeople',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '发货人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shouhuoPeople',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '收货人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'shouhuoAddress',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '收货地址'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toAddress',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '到达站'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'songhuoType',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '送货方式',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str = "";
                                if (value == 0) {
                                    str = "自提";
                                } else if (value == 1) {
                                    str = "送货";
                                }
                                return str;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'payType',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '结算方式',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                var str="";
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
                            flex: 1,
                            text: '运费'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'moneyHuikouXianFan',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '回扣'
                        },
                        {
                            xtype: 'gridcolumn',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '实际运费',
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                return record.data.moneyYunfei - record.data.moneyHuikouXianFan;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'zhidanRen',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '制单人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'memo',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '备注'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'yundan_id',
                            sortable: false,
                            menuDisabled: true,
                            text: '操作',
                            width: 200,
                            renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                return "<a href='JavaScript:void(0)' onclick='Edit(\"" + value + "\")'>修改</a>&nbsp;<a href='JavaScript:void(0)' onclick='del(\"" + value + "\")'>删除</a>";
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
                                    xtype: 'textfield',
                                    id: 'cx_keyword',
                                    labelWidth: 60,
                                    fieldLabel: '关键字'
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'search',
                                            text: '查询',
                                            handler: function () {
                                                BindData(1);
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'buttongroup',
                                    title: '',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'add',
                                            text: '新增',
                                            handler: function () {
                                                Edit("");
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: YDStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new YDView();
    BindData(1);

})
//************************************主界面*****************************************