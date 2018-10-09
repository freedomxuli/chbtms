
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
        ["", "", "", "", "", "", "", "是否打印格子", 1],
        ["", "", "", "", "", "", "", "第一个地址", 2],
        ["", "", "", "", "", "", "", "第一个收件人名", 3],
        ["", "", "", "", "", "", "", "第一个收件人电话", 4],
        ["", "", "", "", "", "", "", "第一个件数", 5],
        ["", "", "", "", "", "", "", "第一个货物名称", 6],
        ["", "", "", "", "", "", "", "第一个备注", 7],
        ["", "", "", "", "", "", "", "单个标签高度", 8],
        ["", "", "", "", "", "", "", "单个标签宽度", 9],
        ["", "", "", "", "", "", "", "每行打印个数", 10]
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
                                                  allowBlank: false,
                                                  allowDecimals: false
                                              },
                                              renderer: function (value, cellmeta) {
                                                  console.log(value);
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
                                                  allowDecimals: false,
                                                  id:"tfId",
                                              },
                                                renderer: function (value, cellmeta, record) {
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
                                            hidden:true,
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
                                            hidden: true,
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

                                for (var i = 0; i < ypstore.data.items.length; i++) {
                                    printlist.push(ypstore.data.items[i].data);
                                }

                                //CS('CZCLZ.PrinterMag.SavePrint', function (retVal) {
                                //    if (retVal) {
                                //        Ext.Msg.show({
                                //            title: '提示',
                                //            msg: '保存成功!',
                                //            buttons: Ext.MessageBox.OK,
                                //            icon: Ext.MessageBox.INFO
                                //        });
                                //    }

                                //}, CS.onError, ztlist, printlist, 1);
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
        if (retVal.ztdt.length>0) {
            ztstore.loadData(retVal.ztdt);

            if (retVal.jichu_print) {
                ypstore.loadData(retVal.jichu_print);
            }
        }
    }, CS.onError, 1);
});