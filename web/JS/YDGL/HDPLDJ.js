var pageSize = 20;
var Page = 1;
//************************************数据源*****************************************
var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_chaifen_id' },
       { name: 'yundan_id' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' },
       { name: 'bschuidanDate' },
       { name: 'huidanDate' },
       { name: 'huidanBack' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        Page = nPage;
        BindData(nPage);
    }
});

var XZStore = Ext.create('Ext.data.Store', {
    fields: [
        { name: 'yundan_chaifen_id' },
        { name: 'yundan_id' },
       { name: 'yundanDate' },
       { name: 'yundan_chaifen_number' },
       { name: 'zhuangchedanNum' },
       { name: 'hxrq' },
       { name: 'officeId' },
       { name: 'officeName' },
       { name: 'toOfficeId' },
       { name: 'toOfficeName' },
       { name: 'toAddress' },
       { name: 'fahuoPeople' },
       { name: 'fahuoTel' },
       { name: 'shouhuoPeople' },
       { name: 'shouhuoTel' },
       { name: 'shouhuoAddress' },
       { name: 'songhuoType' },
       { name: 'moneyYunfei' },
       { name: 'payType' },
       { name: 'moneyXianfu' },
       { name: 'moneyDaofu' },
       { name: 'moneyQianfu' },
       { name: 'moneyHuidanfu' },
       { name: 'moneyHuikouXianFan' },
       { name: 'zhidanRen' },
       { name: 'moneyDaishou' },
       { name: 'moneyDaishouShouxu' },
       { name: 'huidanType' },
       { name: 'memo' },
       { name: 'cntHuidan' },
       { name: 'bschuidanDate' },
       { name: 'huidanDate' },
       { name: 'huidanBack' }
       ],
    data: [
    ]
});

var HPStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
        { name: 'yundan_goods_id' },
        { name: 'yundan_chaifen_id' },
        { name: 'yundan_goodsName' },
        { name: 'yundan_goodsPack' },
        { name: 'yundan_goodsAmount' },
        { name: 'yundan_goodsWeight' },
        { name: 'yundan_goodsVolume' },
        { name: 'status' },
        { name: 'addtime' },
        { name: 'adduser' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindHPList(nPage);
    }
});
var qszstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});

var zdzstore = Ext.create('Ext.data.Store', {
    fields: ['officeId', 'officeName'],
    data: [
    ]
});
//************************************数据源*****************************************

//************************************页面方法***************************************
function GetQSZ() {
    CS('CZCLZ.YDMag.GetYDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp("cx_qsz").setValue(retVal[0]["officeId"]);

    }, CS.onError)
}


function GetZDZ() {
    CS('CZCLZ.YDMag.GetYDZDZ', function (retVal) {
        zdzstore.loadData(retVal);
        Ext.getCmp("cx_zdz").setValue(retVal[0]["officeId"]);
    }, CS.onError)
}

function BindData(nPage) {
    CS('CZCLZ.YDMag.GetHDList', function (retVal) {
        YDStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, Ext.getCmp("cx_qsz").getValue(), Ext.getCmp("cx_ddz").getValue(), Ext.getCmp("cx_huidanType").getValue(),
    Ext.getCmp("cx_sjlx").getValue(), Ext.getCmp("cx_beg").getValue(), Ext.getCmp("cx_end").getValue(),
    Ext.getCmp("cx_ydh").getValue(), Ext.getCmp("cx_zcdh").getValue(), Ext.getCmp("cx_hpm").getValue(), Ext.getCmp("cx_fhr").getValue(), Ext.getCmp("cx_shr").getValue());
}

function BindHPList(nPage, cfid) {
    CS('CZCLZ.ZCDMag.GetHPList', function (retVal) {
        HPStore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, cfid);
}

function ShowHPList(cfid) {
    cfid = cfid;
    BindHPList(1, cfid);
    var win = new HPList();
    win.show();
}
//************************************页面方法***************************************

//************************************弹出界面***************************************
Ext.define('HPList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 700,
    height: 300,
    layout: {
        type: 'fit'
    },
    title: '查看运单货品',
    id: 'HPListWin',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [
                    {
                        xtype: 'panel',
                        layout: {
                            type: 'fit'
                        },
                        autoScroll: true,
                        dockedItems: [
                        ],
                        items: [
                                    {
                                        xtype: 'gridpanel',
                                        id: 'HPListpanel',
                                        store: HPStore,
                                        columnLines: true,
                                        columns: [
                                            {
                                                xtype: 'rownumberer',
                                                //这里可以设置你的宽度
                                                width: 35,
                                                sortable: false,
                                                menuDisabled: true,
                                            },
                                            {
                                                dataIndex: 'yundan_goodsName',
                                                flex: 1,
                                                text: '货品',
                                                sortable: false,
                                                menuDisabled: true
                                            },
                                            {
                                                dataIndex: 'yundan_goodsPack',
                                                flex: 1,
                                                text: '包装',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsAmount',
                                                flex: 1,
                                                text: '件数',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsWeight',
                                                flex: 1,
                                                text: '重量',
                                                sortable: false,
                                                menuDisabled: true
                                            }, {
                                                dataIndex: 'yundan_goodsVolume',
                                                flex: 1,
                                                text: '体积',
                                                sortable: false,
                                                menuDisabled: true
                                            }
                                        ],
                                        dockedItems: [

                        {
                            xtype: 'pagingtoolbar',
                            displayInfo: true,
                            store: HPStore,
                            dock: 'bottom'
                        }
                                        ]

                                    },

                        ]
                    }

            ]
        });

        me.callParent(arguments);
    }
});

Ext.define('TYSZ', {
    extend: 'Ext.window.Window',

    height: 300,
    width: 400,
    layout: {
        type: 'fit'
    },
    closeAction: 'destroy',
    modal: true,
    title: '统一设置',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'form',
                id: 'TYSZform',
                frame: true,
                bodyPadding: 10,
                title: '',
                items: [
                    {
                        xtype: 'combobox',
                        id: 'sjtype',
                        editable: false,
                        allowBlank: false,
                        fieldLabel: '选择设置项目',
                        store: new Ext.data.ArrayStore({
                            fields: ['TXT', 'VAL'],
                            data: [
                                ['点击选择', ""],
                                ['办事处回单', "bschuidanDate"],
                                ['回单收到', "huidanDate"],
                                ['回单送出', "huidanBack"]
                            ]
                        }),
                        queryMode: 'local',
                        displayField: 'TXT',
                        valueField: 'VAL',
                        anchor: '100%',
                        value: ""
                    },
                    {
                        xtype: 'datefield',
                        allowBlank: false,
                        format: 'Y-m-d',
                        fieldLabel: '登记日期',
                        editable: false,
                        id:'djrq',
                        anchor: '100%',
                        value: new Date()
                    }

                ],
                buttonAlign: 'center',
                buttons: [
                    {
                        text: '确定',
                        handler: function () {
                            var form = Ext.getCmp('TYSZform');
                            if (form.form.isValid()) {
                                var xzlist = [];
                                for (var i = 0; i < XZStore.data.items.length; i++) {
                                    xzlist.push(XZStore.data.items[i].data.yundan_id);
                                }
                                var me = this;
                                if (Ext.getCmp("sjtype").getValue()) {
                                    if (Ext.getCmp("sjtype").getValue() == "bschuidanDate") {
                                        CS('CZCLZ.YDMag.SaveBSCHD', function (retVal) {
                                            if (retVal) {
                                                BindData(Page);
                                                me.up('window').close();
                                            }
                                        }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                    } else if (Ext.getCmp("sjtype").getValue() == "huidanDate") {
                                        CS('CZCLZ.YDMag.SaveHDSD', function (retVal) {
                                            if (retVal) {
                                                BindData(Page);
                                                me.up('window').close();
                                            }
                                        }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                    } else if (Ext.getCmp("sjtype").getValue() == "huidanBack") {
                                        CS('CZCLZ.YDMag.SaveHDSC', function (retVal) {
                                            if (retVal) {
                                                BindData(Page);
                                                me.up('window').close();
                                            }
                                        }, CS.onError, xzlist, Ext.getCmp("djrq").getValue());
                                    }

                                } else {
                                    Ext.Msg.alert('提示', "请选择要设置项目！");
                                    return;
                                }
                            }
                        }
                    },
                    {
                        text: '取消',
                        handler: function () {
                            this.up('window').close();
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
                    selModel: Ext.create('Ext.selection.CheckboxModel', {
                        selType: 'rowmodel',
                        mode: 'SIMPLE',
                        listeners: {
                            deselect: function (model, record, index) {//取消选中时产生的事件
                                if (XZStore.data.length > 0) {
                                    for (var i = 0; i < XZStore.data.length; i++) {
                                        if (XZStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                            XZStore.remove(XZStore.data.items[i]);
                                        }
                                    }
                                }
                            },
                            select: function (model, record, index) {//record被选中时产生的事件
                                var n = 1;
                                if (XZStore.data.length > 0) {
                                    for (var i = 0; i < XZStore.data.length; i++) {
                                        if (XZStore.data.items[i].data.yundan_chaifen_id == record.get('yundan_chaifen_id')) {
                                            n--;
                                        }
                                    }
                                }
                                if (n == 1) {
                                    XZStore.add(record.data);
                                }
                            },
                        }
                    }),
                    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            edit: function (editor, e) {
                                if (e.field == "bschuidanDate") {
                                    CS('CZCLZ.YDMag.SaveBSCHD', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                        }
                                    }, CS.onError, [e.record.data.yundan_id], e.record.data.bschuidanDate);
                                } else if (e.field == "huidanDate") {
                                    CS('CZCLZ.YDMag.SaveHDSD', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                        }
                                    }, CS.onError, [e.record.data.yundan_id], e.record.data.huidanDate);
                                } else if (e.field == "huidanBack") {
                                    CS('CZCLZ.YDMag.SaveHDSC', function (retVal) {
                                        if (retVal) {
                                            BindData(Page);
                                        }
                                    }, CS.onError, [e.record.data.yundan_id], e.record.data.huidanBack);
                                }
                            }
                        }
                    })],
                    columns: [Ext.create('Ext.grid.RowNumberer'),
                         {
                             xtype: 'gridcolumn',
                             dataIndex: 'yundan_chaifen_number',
                             width: 150,
                             text: '运单号',
                             menuDisabled: true,
                             sortable: false
                         },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'yundanDate',
                                 width: 80,
                                 format: 'Y-m-d',
                                 text: '制单日期',
                                 menuDisabled: true,
                                 sortable: false

                             },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'bschuidanDate',
                                 width: 100,
                                 sortable: false,
                                 menuDisabled: true,
                                 text: '办事处回单',
                                 format:'Y-m-d',
                                 field: {
                                     xtype: 'datefield',
                                     selectOnFocus: true,
                                     allowBlank: false,
                                     allowDecimals: false,
                                     format: 'Y-m-d'
                                 },
                                 renderer: function (value, cellmeta) {
                                     cellmeta.style = 'background: #99CCFF ';
                                     if (value) {
                                        return new Date(value).Format("yyyy-MM-dd");
                                     }
                                 }
                             },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'huidanDate',
                                 width: 100,
                                 sortable: false,
                                 menuDisabled: true,
                                 text: '回单收到',
                                 format: 'Y-m-d',
                                 field: {
                                     xtype: 'datefield',
                                     selectOnFocus: true,
                                     allowBlank: false,
                                     allowDecimals: false,
                                     format: 'Y-m-d'
                                 },
                                 renderer: function (value, cellmeta) {
                                     cellmeta.style = 'background: #99CCFF ';
                                     if (value) {
                                         return new Date(value).Format("yyyy-MM-dd");
                                     }
                                 }
                             },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'huidanBack',
                                 width: 100,
                                 sortable: false,
                                 menuDisabled: true,
                                 text: '回单送出',
                                 format: 'Y-m-d',
                                 field: {
                                     xtype: 'datefield',
                                     selectOnFocus: true,
                                     allowBlank: false,
                                     allowDecimals: false,
                                     format: 'Y-m-d'
                                 },
                                 renderer: function (value, cellmeta) {
                                     cellmeta.style = 'background: #99CCFF ';
                                     if (value) {
                                         return new Date(value).Format("yyyy-MM-dd");
                                     }
                                 }
                             },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                width: 150,
                                text: '装车单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toOfficeName',
                                width: 80,
                                text: '到达站',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAddress',
                                width: 80,
                                text: '到达站',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoPeople',
                                width: 90,
                                text: '发货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoTel',
                                width: 90,
                                text: '发货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoPeople',
                                width: 90,
                                text: '收货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoTel',
                                width: 90,
                                text: '收货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                             {
                                 xtype: 'gridcolumn',
                                 dataIndex: 'shouhuoAddress',
                                 width: 180,
                                 text: '收货地址',
                                 menuDisabled: true,
                                 sortable: false
                             },
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'huidanType',
                                  width: 70,
                                  text: '回单/收条',
                                  menuDisabled: true,
                                  sortable: false,
                                  renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                      var str = "";
                                      if (parseInt(value) == 0) {
                                          str = "回单";
                                      } else if (parseInt(value) == 1) {
                                          str = "收条";
                                      }
                                      return str;
                                  }

                              },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'cntHuidan',
                                     width: 65,
                                     text: '回单张数',
                                     menuDisabled: true,
                                     sortable: false
                                 },
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'songhuoType',
                                  width: 65,
                                  text: '送货方式',
                                  menuDisabled: true,
                                  sortable: false,
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
                                   dataIndex: 'moneyYunfei',
                                   width: 100,
                                   text: '运费',
                                   menuDisabled: true,
                                   sortable: false
                               },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'payType',
                                   width: 110,
                                   text: '结算方式',
                                   menuDisabled: true,
                                   sortable: false,
                                   renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                       var str = "";
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
                                       return str
                                   }
                               },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyXianfu',
                                    width: 100,
                                    text: '现付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaofu',
                                    width: 100,
                                    text: '到付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyQianfu',
                                    width: 100,
                                    text: '欠付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuidanfu',
                                    width: 100,
                                    text: '回单付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuikouXianFan',
                                    width: 100,
                                    text: '回扣',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'zhidanRen',
                                    width: 90,
                                    text: '制单人',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishou',
                                    width: 90,
                                    text: '代收',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishouShouxu',
                                    width: 90,
                                    text: '代收手续费',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'yundan_chaifen_id',
                                     sortable: false,
                                     menuDisabled: true,
                                     text: '操作',
                                     width: 100,
                                     renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                         cfid = value;
                                         return "<a href='JavaScript:void(0)' onclick='ShowHPList(\"" + cfid + "\")'>查看货品</a>";
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
                                    xtype: 'combobox',
                                    id: 'cx_qsz',
                                    fieldLabel: '起始站',
                                    editable: false,
                                    store: qszstore,
                                    queryMode: 'local',
                                    displayField: 'TEXT',
                                    valueField: 'VALUE',
                                    width: 180,
                                    labelWidth: 60
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_ddz',
                                    fieldLabel: '到达站',
                                    editable: false,
                                    store: zdzstore,
                                    queryMode: 'local',
                                    displayField: 'TEXT',
                                    valueField: 'VALUE',
                                    width: 180,
                                    labelWidth: 60
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_huidanType',
                                    editable: false,
                                    store: new Ext.data.ArrayStore({
                                        fields: ['TXT', 'VAL'],
                                        data: [
                                            ['回单收条', ""],
                                            ['回单', 0],
                                            ['收条', 1]
                                        ]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'TXT',
                                    valueField: 'VAL',
                                    width: 180,
                                    value: ""
                                },
                                {
                                    xtype: 'combobox',
                                    id: 'cx_sjlx',
                                    editable: false,
                                    store: new Ext.data.ArrayStore({
                                        fields: ['TXT', 'VAL'],
                                        data: [
                                            ['时间类型', ""],
                                            ['运单日期', "yundanDate"],
                                            ['办事处回单', "bschuidanDate"],
                                            ['回单收到', "huidanDate"],
                                            ['回单送出', "huidanBack"]
                                        ]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'TXT',
                                    valueField: 'VAL',
                                    width: 180,
                                    labelWidth: 60,
                                    value: ""
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'cx_beg',
                                    fieldLabel: '起始日期',
                                    width: 180,
                                    format: 'Y-m-d',
                                    labelWidth: 60,
                                    value: new Date()
                                },
                                {
                                    xtype: 'datefield',
                                    id: 'cx_end',
                                    fieldLabel: '截止日期',
                                    width: 180,
                                    format: 'Y-m-d',
                                    labelWidth: 60,
                                    value: new Date()
                                }
                            ]
                        },
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'textfield',
                                    id: 'cx_ydh',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '运单号'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_zcdh',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '装车单号'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_hpm',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '货品名'
                                },
                                {
                                    xtype: 'textfield',
                                    id: 'cx_fhr',
                                    labelWidth: 60,
                                    width: 180,
                                    fieldLabel: '发货人'
                                },
                                 {
                                     xtype: 'textfield',
                                     id: 'cx_shr',
                                     labelWidth: 60,
                                     width: 180,
                                     fieldLabel: '收货人'
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
                                            text: '导出',
                                            handler: function () {
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
                                            text: '导出选中运单',
                                            handler: function () {
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
                                            text: '统一设置',
                                            handler: function () {
                                                var win = new TYSZ();
                                                win.show();
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
    //GetQSZ();
    //GetZDZ()
    new YDView();
    BindData(1);

})

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//************************************主界面*****************************************