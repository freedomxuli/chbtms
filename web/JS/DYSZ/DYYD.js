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
        ["", "", "", "", "", "", "", "查货宝", 1],
        ["", "", "", "", "", "", "", "公司地址1（到达办事处）", 2],
        ["", "", "", "", "", "", "", "公司地址2（起始办事处）", 3],
        ["", "", "", "", "", "", "", "起运地点", 4],
        ["", "", "", "", "", "", "", "到达地点", 5],
        ["", "", "", "", "", "", "", "到达网点", 6],
        ["", "", "", "", "", "", "", "欠付", 7],
        ["", "", "", "", "", "", "", "已付", 8],
        ["", "", "", "", "", "", "", "到付", 9],
        ["", "", "", "", "", "", "", "运单编号", 10],
        ["", "", "", "", "", "", "", "回单数", 11],
        ["", "", "", "", "", "", "", "收条数", 12],
        ["", "", "", "", "", "", "", "回单", 13],
        ["", "", "", "", "", "", "", "收条", 14],
        ["", "", "", "", "", "", "", "收货人（单位）", 15],
        ["", "", "", "", "", "", "", "收货地址", 16],
        ["", "", "", "", "", "", "", "收货电话", 17],
        ["", "", "", "", "", "", "", "托运人（单位）", 18],
        ["", "", "", "", "", "", "", "托运地址", 19],
        ["", "", "", "", "", "", "", "托运电话", 20],
        ["", "", "", "", "", "", "", "货物名称", 21],
        ["", "", "", "", "", "", "", "包装", 22],
        ["", "", "", "", "", "", "", "件数", 23],
        ["", "", "", "", "", "", "", "重量", 24],
        ["", "", "", "", "", "", "", "体积", 25],
        ["", "", "", "", "", "", "", "运费", 26],
        ["", "", "", "", "", "", "", "回扣", 27],
        ["", "", "", "", "", "", "", "金额（小写）", 28],
        ["", "", "", "", "", "", "", "金额（大写）", 29],
        ["", "", "", "", "", "", "", "金额大写字距", 30],
        ["", "", "", "", "", "", "", "备注", 31],
        ["", "", "", "", "", "", "", "签名", 32],
        ["", "", "", "", "", "", "", "签单年", 33],
        ["", "", "", "", "", "", "", "签单月", 34],
        ["", "", "", "", "", "", "", "签单日", 35],
        ["", "", "", "", "", "", "", "自提", 36],
        ["", "", "", "", "", "", "", "送货到家", 37],
    ]
})

Ext.onReady(function () {
    Ext.define('DYYD', {
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

                                    CS('CZCLZ.PrinterMag.SavePrint_YD', function (retVal) {
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
                                        fieldLabel: '配送方式显示文字',
                                        id: "psfs",
                                        name: "psfs",
                                        labelWidth: 120,
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
                                        xtype: 'combobox',
                                        allowBlank: false,
                                        displayField: 'TXT',
                                        valueField: 'VAL',
                                        queryMode: 'local',
                                        anchor: '100%',
                                        padding: 10,
                                        editable: false,
                                        fieldLabel: '结算方式显示文字',
                                        id: "jsfs",
                                        name: "jsfs",
                                        labelWidth: 120,
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
                                         xtype: 'combobox',
                                         allowBlank: false,
                                         displayField: 'TXT',
                                         valueField: 'VAL',
                                         queryMode: 'local',
                                         anchor: '100%',
                                         padding: 10,
                                         editable: false,
                                         fieldLabel: '运费大写显示文字',
                                         id: 'yfdx',
                                         name: "yfdx",
                                         labelWidth: 120,
                                         store: new Ext.data.ArrayStore({
                                             fields: ['TXT', 'VAL'],
                                             data: [
                                                 ['是', 0],
                                                 ['否', 1]
                                             ]
                                         }),
                                         value: 1
                                     }, {
                                         xtype: 'combobox',
                                         allowBlank: false,
                                         displayField: 'TXT',
                                         valueField: 'VAL',
                                         queryMode: 'local',
                                         anchor: '100%',
                                         padding: 10,
                                         editable: false,
                                         fieldLabel: '日期显示文字',
                                         id: 'rq',
                                         name: "rq",
                                         labelWidth: 120,
                                         store: new Ext.data.ArrayStore({
                                             fields: ['TXT', 'VAL'],
                                             data: [
                                                 ['是', 0],
                                                 ['否', 1]
                                             ]
                                         }),
                                         value: 1
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
                    ]
                }


            ];
            me.callParent(arguments);
        }
    });

    new DYYD();

    CS('CZCLZ.PrinterMag.GetPrintYD', function (retVal) {
        if (retVal.ztdt.length > 0) {
            ztstore.loadData(retVal.ztdt);

            if (retVal.printdt) {
                ypstore.loadData(retVal.printdt);
            }
            Ext.getCmp("psfs").setValue(retVal.psfs);
            Ext.getCmp("jsfs").setValue(retVal.jsfs);
            Ext.getCmp("yfdx").setValue(retVal.yfdx);
            Ext.getCmp("rq").setValue(retVal.rq);

        }
    }, CS.onError, 1);
});