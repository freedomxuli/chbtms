﻿var ztstore = new Ext.data.ArrayStore({
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
        ["", "", "", "", "", "", "", "第一个地址", 1],
        ["", "", "", "", "", "", "", "第一个收件人名", 2],
        ["", "", "", "", "", "", "", "第一个收件人电话", 3],
        ["", "", "", "", "", "", "", "第一个件数", 4],
        ["", "", "", "", "", "", "", "第一个货物名称", 5],
        ["", "", "", "", "", "", "", "第一个备注", 6]
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
                    layout: {
                        type: 'border'
                    },
                    region: 'center',
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



                                var form = Ext.getCmp('editform');
                                if (form.form.isValid()) {

                                    var values = form.form.getValues(false);
                                    var me = this;

                                    CS('CZCLZ.PrinterMag.SavePrint_BQ', function (retVal) {
                                        if (retVal) {
                                            Ext.Msg.show({
                                                title: '提示',
                                                msg: '保存成功!',
                                                buttons: Ext.MessageBox.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                        }

                                    }, CS.onError, ztlist, printlist, values);
                                }
                            }
                        }
                        
                    ],
                    items: [
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            width: '100%',
                            border: false,
                            region: 'north',
                            items: [
                                 {
                                     xtype: 'gridpanel',
                                     store: ztstore,
                                     border: true,
                                     title: '整体偏移设置',
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
                                         }
                                     ],
                                     viewConfig: {

                                     }
                                 }

                            ]

                        },
                        {
                            xtype: 'panel',
                            title: '打印调整',
                            region: 'north',
                            layout: {
                                type: 'fit'
                            },
                            border: false,
                            items: [
                                {

                                    xtype: 'form',
                                    id: 'editform',
                                    frame: true,
                                    bodyPadding: 10,
                                    title: '',
                                    items: [
                                    {
                                        xtype: 'combobox',
                                        allowBlank: false,
                                        displayField: 'TXT',
                                        valueField: 'VAL',
                                        queryMode: 'local',
                                        anchor: '100%',
                                        padding: 10,
                                        editable: false,
                                        fieldLabel: '是否打印格子',
                                        id: 'sfdygz',
                                        name: 'sfdygz',
                                        store: new Ext.data.ArrayStore({
                                            fields: ['TXT', 'VAL'],
                                            data: [
                                                ['是', 0],
                                                ['否', 1]
                                            ]
                                        }),
                                        value: 1
                                    },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '单个标签高度',
                                    padding: 10,
                                    anchor: '100%',
                                    id: 'bqgd',
                                    name: 'bqgd',
                                    allowDecimals: false
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '单个标签宽度',
                                    padding: 10,
                                    anchor: '100%',
                                    id: 'bqkd',
                                    name: 'bqkd',
                                    allowDecimals: false
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: '每行打印个数',
                                    padding: 10,
                                    anchor: '100%',
                                    id: 'mhdygs',
                                    name: 'mhdygs',
                                    allowDecimals: false
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
                            region: 'center',

                            items: [

                                {
                                    xtype: 'gridpanel',
                                    store: ypstore,
                                    border: true,
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
                                            hidden: true,
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
                    ]
                }
                        
                
            ];
            me.callParent(arguments);
        }
    });

    new DYXF();

    CS('CZCLZ.PrinterMag.GetPrintBQ', function (retVal) {
        if (retVal.ztdt.length > 0) {
            ztstore.loadData(retVal.ztdt);

            if (retVal.printdt) {
                ypstore.loadData(retVal.printdt);
            }
            Ext.getCmp("sfdygz").setValue(retVal.sfdygz);
            Ext.getCmp("bqgd").setValue(retVal.dygd);
            Ext.getCmp("bqkd").setValue(retVal.dykd);
            Ext.getCmp("mhdygs").setValue(retVal.mhdygs);
            
        }
    }, CS.onError, 1);
});