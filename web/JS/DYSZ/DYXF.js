
var ztstore = new Ext.data.ArrayStore({
    fields: [
        { name: 'print_id', type: 'string' },
        { name: 'leftBJ', type: 'string' },
        { name: 'topBJ', type: 'string' }

    ],
    data: [
        ["", "", ""]
    ]
})


var ypstore = new Ext.data.ArrayStore({
    fields: [
        { name: 'print_id', type: 'string' },
        { name: 'leftBJ', type: 'string' },
        { name: 'topBJ', type: 'string' },
        { name: 'fontSize', type: 'string' },
        { name: 'width', type: 'string' },
        { name: 'height', type: 'string' },
        { name: 'fieldName', type: 'string' },
        { name: 'fieldMC', type: 'string' },
         { name: 'px', type: 'int' }

    ],
    data: [
        ["", "", "", "", "", "", "", "送货",1],
        ["", "", "", "", "", "", "", "自提", 2],
        ["", "", "", "", "", "", "cntHuidan", "回单", 3],
        ["", "", "", "", "", "", "cntHuidan", "收条", 4],
        ["", "", "", "", "", "", "memo", "备注", 5],
        ["", "", "", "", "", "", "yundanNum", "运单号", 6],
        ["", "", "", "", "", "", "yundan_goodsName", "货物名称", 7],
        ["", "", "", "", "", "", "yundan_goodsAmount", "件数", 8],
        ["", "", "", "", "", "", "yundan_goodsPack", "包装", 9],
        ["", "", "", "", "", "", "yundan_goodsWeight", "重量", 10],
        ["", "", "", "", "", "", "yundan_goodsVolume", "体积", 11],
        ["", "", "", "", "", "", "huidanType", "回单，收条", 12],
        ["", "", "", "", "", "", "shouhuoAddress", "地址", 13],
        ["", "", "", "", "", "", "shouhuoPeople", "联系人", 14],
        ["", "", "", "", "", "", "shouhuoTel", "电话", 15],
        ["", "", "", "", "", "", "moneyDaofu", "到付", 16],
        ["", "", "", "", "", "", "payType", "付费方式", 17],
        ["", "", "", "", "", "", "", "日期年", 18],
        ["", "", "", "", "", "", "", "日期月", 19],
        ["", "", "", "", "", "", "", "日期日", 20]
    ]
})

    


Ext.onReady(function () {
    Ext.define('DYXF', {
        extend: 'Ext.container.Viewport',

        layout: {
            type: 'border'
        },
        initComponent: function () {
            var me = this;
            me.items = [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            width: '100%',
                            border: false,
                            region: 'center',
                            items: [
                                 {
                                    xtype: 'gridpanel',
                                    store: ztstore,
                                    border: true,
                                    title: '整体偏移设置',
                                    columnLines: true,
                                    plugins: [ Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1
                                    })],
                                    columns: [Ext.create('Ext.grid.RowNumberer', { width: 30 }),
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'print_id',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            hidden: true,
                                            text: '打印ID'
                                        },
                                          {
                                              xtype: 'numbercolumn',
                                              dataIndex: 'leftBJ',
                                              flex: 1,
                                              sortable: false,
                                              menuDisabled: true,
                                              text: '左边距',
                                              field: {
                                                  xtype: 'numberfield',
                                                  selectOnFocus: true,
                                                  allowDecimals: false
                                              },
                                              renderer: function (value, cellmeta) {
                                                  cellmeta.style = 'background: #99CCFF ';
                                                  return value;
                                              }
                                          },
                                        {
                                            xtype: 'numbercolumn',
                                            dataIndex: 'topBJ',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '上边距',
                                            field: {
                                                xtype: 'numberfield',
                                                selectOnFocus: true
                                            },
                                            renderer: function (value, cellmeta) {
                                                cellmeta.style = 'background: #99CCFF ';
                                                return value;
                                            }
                                        }
                                    ],
                                    viewConfig: {

                                    }
                                }
                                             
                            ]

                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            flex: 1,
                    
                            items: [

                                {
                                    xtype: 'gridpanel',
                                    store: ypstore,
                                    border: true,
                                    title: '打印调整',
                                    columnLines: true,
                                    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1
                                    })],
                                    columns: [Ext.create('Ext.grid.RowNumberer', { width: 30 }),
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'print_id',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            hidden: true,
                                            text: '打印ID'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fieldName',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            hidden: true,
                                            text: '字段'
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'fieldMC',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '字段名'
                                        },
                                          {
                                              xtype: 'numbercolumn',
                                              dataIndex: 'leftBJ',
                                              flex: 1,
                                              sortable: false,
                                              menuDisabled: true,
                                              text: '左边距',
                                              field: {
                                                  xtype: 'numberfield',
                                                  selectOnFocus: true,
                                                  allowBlank: false,
                                                  allowDecimals: false
                                              },
                                              renderer: function (value, cellmeta) {
                                                  cellmeta.style = 'background: #99CCFF ';
                                                  return value;
                                              }
                                          },
                                        {
                                            xtype: 'numbercolumn',
                                            dataIndex: 'topBJ',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '上边距',
                                            field: {
                                                xtype: 'numberfield',
                                                selectOnFocus: true,
                                                allowBlank: false,
                                                allowDecimals: false
                                            },
                                            renderer: function (value, cellmeta) {
                                                cellmeta.style = 'background: #99CCFF ';
                                                return value;
                                            }
                                        },
                                        {
                                            xtype: 'numbercolumn',
                                            dataIndex: 'fontSize',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '字号',
                                            field: {
                                                xtype: 'numberfield',
                                                selectOnFocus: true,
                                                allowBlank: false,
                                                allowDecimals: false
                                            },
                                            renderer: function (value, cellmeta) {
                                                cellmeta.style = 'background: #99CCFF ';
                                                return value;
                                            }
                                        },
                                        {
                                            xtype: 'numbercolumn',
                                            dataIndex: 'width',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '宽度',
                                            field: {
                                                xtype: 'numberfield',
                                                selectOnFocus: true,
                                                allowBlank: false,
                                                allowDecimals: false
                                            },
                                            renderer: function (value, cellmeta) {
                                                cellmeta.style = 'background: #99CCFF ';
                                                return value;
                                            }
                                        },
                                        {
                                            xtype: 'numbercolumn',
                                            dataIndex: 'height',
                                            flex: 1,
                                            sortable: false,
                                            menuDisabled: true,
                                            text: '高度',
                                            field: {
                                                xtype: 'numberfield',
                                                selectOnFocus: true,
                                                allowBlank: false,
                                                allowDecimals: false
                                            },
                                            renderer: function (value, cellmeta) {
                                                cellmeta.style = 'background: #99CCFF ';
                                                return value;
                                            }
                                        }
                                
                                    ],
                                    viewConfig: {

                                    }
                                }
                            ]
                        }
                          
                    ],
                    buttonAlign: 'center',
                    buttons: [
                        {
                            text: '保存',
                            iconCls: 'save',
                            handler: function () {
                                var ztlist = [];
                                for (var i = 0; i < ztstore.data.items.length; i++) {
                                    ztlist.push(ztstore.data.items[i].data);
                                }

                                var printlist = [];
                                for (var i = 0; i < ypstore.data.items.length; i++) {
                                    printlist.push(ypstore.data.items[i].data);
                                }

                                CS('CZCLZ.PrinterMag.SavePrint', function (retVal) {
                                    if (retVal) {
                                        Ext.Msg.show({
                                            title: '提示',
                                            msg: '保存成功!',
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                    }

                                }, CS.onError, ztlist, printlist, 0);
                            }
                        }
                        
                    ]

                },
                
            ];
            me.callParent(arguments);
        }
    });

    new DYXF();

    CS('CZCLZ.PrinterMag.GetPrintByKind', function (retVal) {

        if (retVal.ztdt.length > 0) {
            ztstore.loadData(retVal.ztdt);

            if (retVal.printdt.length > 0) {
                ypstore.loadData(retVal.printdt);

            }
        }
    }, CS.onError, 0);
});