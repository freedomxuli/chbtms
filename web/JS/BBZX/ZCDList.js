var pageSize = 20;
//************************************数据源*****************************************
var ZCDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'zhuangchedan_id' },
       { name: 'officeId' },
       { name: 'fromOfficeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'zhuangchedanNum' },
       { name: 'driverId' },
       { name: 'people' },
       { name: 'toAdsPeople' },
       { name: 'toAdsTel' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindData(nPage);
    }
});


function BindData(nPage) {
    CS('CZCLZ.ZCDMag.GetZCDList', function (retVal) {
        ZCDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_zcdh").getValue(), Ext.getCmp("cx_sj").getValue(), Ext.getCmp("cx_pz").getValue());
}
//************************************数据源*****************************************

//************************************页面方法***************************************

function del(id) {
    //Ext.MessageBox.confirm("提示", "是否删除你所选?", function (obj) {
    //    if (obj == "yes") {
    //        CS('CZCLZ.ZCDMag.DeleteZCD', function (retVal) {
    //            if (retVal) {
    //                BindData(1);
    //            }
    //        }, CS.onError, id);
    //    }
    //    else {
    //        return;
    //    }
    //});
}
function Edit(id) {
    FrameStack.pushFrame({
        url: "EditZCD.html?zcdid=" + id,
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
    Ext.define('ZCDView', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'fit'
        },

        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'gridpanel',
                    id: 'ZCDGrid',
                    store: ZCDStore,
                    columnLines: true,
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'zhuangchedanNum',
                            sortable: false,
                            menuDisabled: true,
                            width: 200,
                            text: '装车单号'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'fromOfficeName',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '起始站'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toOfficeName',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '到达站'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'people',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '司机'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toAdsPeople',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '到达站联系人'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'toAdsTel',
                            sortable: false,
                            menuDisabled: true,
                            flex: 1,
                            text: '到达站联系电话'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'zhuangchedan_id',
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
                                    id: 'cx_zcdh',
                                    labelWidth: 60,
                                    fieldLabel: '装车单号'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_sj',
                                    labelWidth: 60,
                                    fieldLabel: '司机'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_pz',
                                    labelWidth: 60,
                                    fieldLabel: '车辆牌照'
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
                            store: ZCDStore,
                            dock: 'bottom'
                        }
                    ]
                }
            ];
            me.callParent(arguments);
        }
    });

    new ZCDView();
    BindData(1);

})
//************************************主界面*****************************************