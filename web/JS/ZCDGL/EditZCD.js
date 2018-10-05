var zcdid = queryString.zcdid;
var pageSize = 10;

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

var ywystore = Ext.create('Ext.data.Store', {
    fields: ['employId', 'employName'],
    data: [
    ]
});
var HPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'yundan_goods_id' },
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
    data: [
    ]
});

var dbfstore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'id' },
       { name: 'people' },
       { name: 'tel' },
       { name: 'carNum' },
       { name: 'actionDate' },
       { name: 'money' },
       { name: 'memo' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindDBF(nPage);
    }
});

var khstore = Ext.create('Ext.data.Store', {
    fields: ['clientId', 'people', 'tel', 'address'],
    data: [
    ]
});


var driverstore = Ext.create('Ext.data.Store', {
    fields: ['driverId', 'people', 'tel', 'carNum'],
    data: [
    ]
});

var YDStore = createSFW4Store({
    data: [],
    pageSize: pageSize,
    total: 1,
    currentPage: 1,
    fields: [
       { name: 'yundan_id' },
       { name: 'isDache' },
       { name: 'isDache' },
       { name: 'isZhuhuodaofu' },
       { name: 'yundanDate' },
       { name: 'yundanNum' },
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
       { name: 'cntHuidan' }
    ],
    onPageChange: function (sto, nPage, sorters) {
        BindYDData(nPage);
    }
});

function GetDriver() {
    CS('CZCLZ.ZCDMag.GetDriver', function (retVal) {
        driverstore.loadData(retVal);
    }, CS.onError)

}


function BindDBF(nPage) {
    CS('CZCLZ.ZCDMag.GetDBFList', function (retVal) {
        dbfstore.setData({
            data: retVal.dt,
            pageSize: pageSize,
            total: retVal.ac,
            currentPage: retVal.cp
        });
    }, CS.onError, nPage, pageSize, ZCDid);
}

function GetKH() {
    CS('CZCLZ.ZCDMag.GetKH', function (retVal) {
        khstore.loadData(retVal);
    }, CS.onError)

}


function GetZCDQSZ() {
    CS('CZCLZ.ZCDMag.GetZCDQSZ', function (retVal) {
        qszstore.loadData(retVal);
        Ext.getCmp("officeId").setValue(retVal[0]["officeId"]);
    }, CS.onError)
}


function GetZCDZDZ() {
    CS('CZCLZ.ZCDMag.GetZCDZDZ', function (retVal) {
        zdzstore.loadData(retVal);
        Ext.getCmp("toOfficeId").setValue(retVal[0]["officeId"]);
    }, CS.onError)
}

function GetZDR() {
    CS('CZCLZ.ZCDMag.GetZDR', function (retVal) {
        Ext.getCmp("zhidanRen").setValue(retVal);
    }, CS.onError)
}

function xghp(id) {
    var r = HPStore.findRecord("yundan_goods_id", id).data;
    var win = new addHPWin();
    win.show(null, function () {
        var form = Ext.getCmp('addHPform');
        form.form.setValues(r);
    });
}

function delhp(id) {
    if (HPStore.data.length > 0) {
        for (var i = 0; i < HPStore.data.length; i++) {
            if (HPStore.data.items[i].data.yundan_goods_id == id) {
                HPStore.remove(HPStore.data.items[i]);
            }
        }
    }
    Ext.getCmp("hpgrid").reconfigure(HPStore);
}

function xgdbf(id) {
    CS('CZCLZ.ZCDMag.GetDBFById', function (retVal) {
        if (retVal) {
            var win = new addDBFWin();
            GetDriver();
            win.show(null, function () {
                var form = Ext.getCmp('addDBFform');
                form.form.setValues(retVal[0]);
            });
        }
    }, CS.onError, id);
}

function deldbf(id) {
    Ext.MessageBox.confirm("提示", "是否删除?", function (obj) {
        if (obj == "yes") {
            CS('CZCLZ.ZCDMag.DeleteDBFById', function (retVal) {
                if (retVal) {
                    BindDBF(1);
                }
            }, CS.onError, id);
        }
        else {
            return;
        }
    });
}

//************************************弹出界面***************************************


//************************************弹出界面***************************************


Ext.onReady(function () {
    Ext.define('EditZCD', {
        extend: 'Ext.container.Viewport',
        layout: {
            type: 'fit'
        },
        initComponent: function () {
            var me = this;

            Ext.applyIf(me, {
                items: [
                    {
                        xtype: 'panel',
                        region: 'center',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        dockedItems: [
                           {
                               xtype: 'toolbar',
                               dock: 'top',
                               items: [
                                   {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: 'button',
                                               iconCls: 'save',
                                               text: '保存',
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
                                       xtype: "button",
                                       text: "打印",
                                       iconCls: "printer",
                                       handler: function () {
                                       }
                                   }
                                       ]
                                   }, {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: "button",
                                               text: "选中运单",
                                               iconCls: "add",
                                               arrowAlign: "right",
                                               menu: [
                                                   { text: "修改(大车送)" },
                                                   { text: "设置(主货到付)" },
                                                   { text: "拆分运单" },
                                                   { text: "修改收货网点" },
                                                   '-',
                                                   { text: "加入装车单" },
                                                   { text: "从装车单中删除" },
                                                   '-',
                                                   { text: "导出" },
                                                   { text: "打印" }
                                               ]
                                           }]
                                   }, {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                   {
                                       xtype: "button",
                                       text: "确认到站",
                                       iconCls: "printer",
                                       handler: function () {
                                       }
                                   }]
                                   },
                                   {
                                       xtype: 'buttongroup',
                                       title: '',
                                       items: [
                                           {
                                               xtype: 'button',
                                               iconCls: 'close',
                                               text: '返回',
                                               handler: function () {
                                                   FrameStack.popFrame();
                                               }
                                           }
                                       ]
                                   }
                               ]
                           }
                        ],
                        items: [
                            {
                                xtype: 'form',
                                layout: {
                                    type: 'column'
                                },

                                id: 'addform',
                                width: '100%',
                                border: false,
                                padding: '10 10 0 10',
                                region: 'center',
                                items: [

                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: 'zhuangchedanNum',
                                                    id: 'zhuangchedanNum',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '装车单号',
                                                    labelWidth: 70,
                                                    value: new Date().Format("yyyyMMddhhmmssS"),
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    allowBlank: false,
                                                    format: 'Y-m-d',
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '签单日期',
                                                    editable: false,
                                                    name: 'qiandanDate',
                                                    id: 'qiandanDate',
                                                    columnWidth: 0.25,
                                                    labelWidth: 70,
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    allowBlank: false,
                                                    format: 'Y-m-d',
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '交付日期',
                                                    editable: false,
                                                    name: 'jiaofuDate',
                                                    id: 'jiaofuDate',
                                                    columnWidth: 0.25,
                                                    labelWidth: 70,
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    id: 'driverId',
                                                    name: 'driverId',
                                                    allowBlank: false,
                                                    displayField: 'people',
                                                    valueField: 'driverId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    store: driverstore,
                                                    fieldLabel: '驾驶员',
                                                    labelWidth: 70,
                                                    listeners: {
                                                        'select': function (o) {
                                                            Ext.getCmp("tel").setValue(o.valueModels[0].data.tel);
                                                            Ext.getCmp("carNum").setValue(o.valueModels[0].data.carNum);
                                                        }
                                                    }
                                                }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '车辆牌照',
                                                    name: 'carNum',
                                                    id: 'carNum',
                                                    labelWidth: 70,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '司机电话',
                                                    name: 'tel',
                                                    id: 'tel',
                                                    labelWidth: 70,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                {
                                                    xtype: 'combobox',
                                                    allowBlank: false,
                                                    displayField: 'officeName',
                                                    valueField: 'officeId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    fieldLabel: '到达站',
                                                    name: 'toOfficeId',
                                                    id: 'toOfficeId',
                                                    labelWidth: 70,
                                                    store: zdzstore
                                                },
                                                  {
                                                      xtype: 'textfield',
                                                      columnWidth: 0.25,
                                                      margin: '5 10 5 10',
                                                      fieldLabel: '联系人',
                                                      name: 'toAdsPeople',
                                                      id: 'toAdsPeople',
                                                      labelWidth: 70
                                                  }

                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textfield',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    fieldLabel: '联系电话',
                                                    name: 'toAdsTel',
                                                    id: 'toAdsTel',
                                                    labelWidth: 70
                                                },
                                                {
                                                    xtype: 'combobox',
                                                    allowBlank: false,
                                                    displayField: 'officeName',
                                                    valueField: 'officeId',
                                                    queryMode: 'local',
                                                    columnWidth: 0.25,
                                                    margin: '5 10 5 10',
                                                    editable: false,
                                                    fieldLabel: '起始站',
                                                    name: 'officeId',
                                                    id: 'officeId',
                                                    labelWidth: 70,
                                                    store: qszstore
                                                }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.24,
                                                    margin: '5 2 5 10',
                                                    fieldLabel: '运费总额',
                                                    name: 'moneyTotal',
                                                    id: 'moneyTotal',
                                                    allowNegative: false,
                                                    minValue: 0,
                                                    labelWidth: 70,
                                                    value: 0,
                                                    allowblank: false

                                                },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },


                                               {
                                                   xtype: 'numberfield',
                                                   columnWidth: 0.24,
                                                   margin: '5 2 5 10',
                                                   fieldLabel: '预付运费',
                                                   name: 'moneyYufu',
                                                   id: 'moneyYufu',
                                                   allowNegative: false,
                                                   minValue: 0,
                                                   labelWidth: 70,
                                                   value: 0,
                                                   allowblank: false

                                               },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },

                                                 {
                                                     xtype: 'numberfield',
                                                     columnWidth: 0.24,
                                                     margin: '5 2 5 10',
                                                     fieldLabel: '尚欠运费',
                                                     name: 'moneyQianfu',
                                                     id: 'moneyQianfu',
                                                     allowNegative: false,
                                                     minValue: 0,
                                                     labelWidth: 70,
                                                     value: 0,
                                                     allowblank: false

                                                 },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                                  {
                                                      xtype: 'numberfield',
                                                      columnWidth: 0.24,
                                                      margin: '5 2 5 10',
                                                      fieldLabel: '点上到付',
                                                      allowNegative: false,
                                                      minValue: 0,
                                                      name: 'moneZCDaofu',
                                                      id: 'moneZCDaofu',
                                                      labelWidth: 70,
                                                      value: 0,
                                                      allowblank: false

                                                  },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'numberfield',
                                                    columnWidth: 0.24,
                                                    margin: '5 2 5 10',
                                                    fieldLabel: '主货到付',
                                                    name: 'moneyZhuhuoDaofu',
                                                    id: 'moneyZhuhuoDaofu',
                                                    allowNegative: false,
                                                    minValue: 0,
                                                    labelWidth: 70,
                                                    value: 0,
                                                    allowblank: false,
                                                    readOnly: true,
                                                    fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'

                                                },
                                                { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, },
                                               {
                                                   xtype: 'numberfield',
                                                   columnWidth: 0.24,
                                                   margin: '5 2 5 10',
                                                   fieldLabel: '本单押金',
                                                   allowNegative: false,
                                                   minValue: 0,
                                                   name: 'moneyYajin',
                                                   id: 'moneyYajin',
                                                   labelWidth: 70

                                               },
                                               { xtype: "displayfield", value: "元", margin: '5 10 5 0', columnWidth: 0.01, }
                                                     ]
                                                 },
                                                 {
                                                     xtype: 'container',
                                                     columnWidth: 1,
                                                     layout: {
                                                         type: 'column'
                                                     },
                                                     items: [
                                                {
                                                    xtype: 'textarea',
                                                    margin: '5 30 5 10',
                                                    columnWidth: 1,
                                                    fieldLabel: '备注',
                                                    name: 'memo',
                                                    id: 'memo',
                                                    labelWidth: 70
                                                }

                                                     ]
                                                 }
                                ]

                            },



                     {
                         xtype: 'tabpanel',
                         padding: '10 10 10 10',
                         layout: {
                             type: 'fit'
                         },
                         flex: 1,
                         items: [
                    {
                        xtype: 'gridpanel',
                        id: 'hpgrid',
                        region: 'center',
                        border: true,
                        store: YDStore,
                        itemId: 'tab1',
                        title: '库存运单',
                        columnLines: true,
                        selModel: Ext.create('Ext.selection.CheckboxModel', {
                            selType: 'rowmodel',
                            mode: 'SIMPLE'
                        }),
                        columns: [
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isDache',
                                flex: 1,
                                text: "大车送",
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'isZhuhuodaofu',
                                flex: 1,
                                text: '主货到付',
                                menuDisabled: true,
                                sortable: false,
                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                    var str = "";
                                    if (value == 0) {
                                        str = "否";
                                    } else if (value == 1) {
                                        str = "是";
                                    }
                                    return str;
                                }

                            },
                             {
                                 xtype: 'datecolumn',
                                 dataIndex: 'yundanDate',
                                 flex: 1,
                                 format: 'Y-m-d',
                                 text: '制单日期',
                                 menuDisabled: true,
                                 sortable: false

                             },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'yundanNum',
                                flex: 1,
                                text: '运单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'zhuangchedanNum',
                                flex: 1,
                                text: '装车单号',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'datecolumn',
                                dataIndex: 'hxrq',
                                flex: 1,
                                format:'Y-m-d',
                                text: '核销时间',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'officeName',
                                flex: 1,
                                text: '办事处',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toOfficeName',
                                flex: 1,
                                text: '收货网点',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'toAddress',
                                flex: 1,
                                text: '到达站',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoPeople',
                                flex: 1,
                                text: '发货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'fahuoTel',
                                flex: 1,
                                text: '发货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoPeople',
                                flex: 1,
                                text: '收货人',
                                menuDisabled: true,
                                sortable: false
                            },
                            {
                                xtype: 'gridcolumn',
                                dataIndex: 'shouhuoTel',
                                flex: 1,
                                text: '收货电话',
                                menuDisabled: true,
                                sortable: false
                            },
                             {
                                 xtype: 'gridcolumn',
                                 dataIndex: 'shouhuoAddress',
                                 flex: 1,
                                 text: '收货地址',
                                 menuDisabled: true,
                                 sortable: false
                             },
                              {
                                  xtype: 'gridcolumn',
                                  dataIndex: 'songhuoType',
                                  flex: 1,
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
                                   flex: 1,
                                   text: '运费',
                                   menuDisabled: true,
                                   sortable: false
                               },
                               {
                                   xtype: 'gridcolumn',
                                   dataIndex: 'payType',
                                   flex: 1,
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
                                       return str;
                                   }
                               },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyXianfu',
                                    flex: 1,
                                    text: '现付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaofu',
                                    flex: 1,
                                    text: '到付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyQianfu',
                                    flex: 1,
                                    text: '欠付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuidanfu',
                                    flex: 1,
                                    text: '回单付',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyHuikouXianFan',
                                    flex: 1,
                                    text: '回扣',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'zhidanRen',
                                    flex: 1,
                                    text: '制单人',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishou',
                                    flex: 1,
                                    text: '代收',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'moneyDaishouShouxu',
                                    flex: 1,
                                    text: '代收手续费',
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'huidanTypes',
                                    flex: 1,
                                    text: '回单/收条',
                                    menuDisabled: true,
                                    sortable: false,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var str = "";
                                        if (value == 0) {
                                            str = "回单";
                                        } else if (value == 1) {
                                            str = "收条";
                                        }
                                        return str;
                                    }

                                },
                                 {
                                     xtype: 'gridcolumn',
                                     dataIndex: 'cntHuidan',
                                     flex: 1,
                                     text: '回单张数',
                                     menuDisabled: true,
                                     sortable: false
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
                                        xtype: 'buttongroup',
                                        title: '',
                                        items: [
                                            {
                                                xtype: 'button',
                                                iconCls: 'add',
                                                text: '新增',
                                                handler: function () {
                                                    var win = new addHPWin();
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
                    }, {
                        xtype: 'panel',
                        itemId: 'tab2',
                        title: '已配送运单'
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
    new EditZCD();

    GetZCDQSZ();
    GetZCDZDZ();
    GetDriver();
    //if (zcdid) {
    //    CS('CZCLZ.ZCDMag.GetZCDByID', function (retVal) {
    //        if (retVal) {

    //            HPStore.loadData(retVal.hpdt);
    //        }
    //    }, CS.onError, ZCDid);

    //}
});

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

