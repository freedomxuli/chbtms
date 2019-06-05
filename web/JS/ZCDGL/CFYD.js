var cfid = queryString.cfid;
var ydid = '';
var isleaf = 0;

var HPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'SP_ID' },
    //{ name: 'yundan_chaifen_id' },
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


var KCFHPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'SP_ID' },
    //{ name: 'yundan_chaifen_id' },
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

var EditKCFHPStore = Ext.create('Ext.data.Store', {
    fields: [{ name: 'SP_ID' },
    //{ name: 'yundan_chaifen_id' },
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

function xghp(id) {
    var r = HPStore.findRecord("SP_ID", id).data;
    var win = new addHPWin();
    win.show(null, function () {
        var form = Ext.getCmp('addHPform');
        form.form.setValues(r);
    });
}

function delhp(id) {
    if (HPStore.data.length > 0) {
        for (var i = 0; i < HPStore.data.length; i++) {
            if (HPStore.data.items[i].data.SP_ID == id) {
                HPStore.remove(HPStore.data.items[i]);
            }
        }
    }
    Ext.getCmp("hpgrid").reconfigure(HPStore);
}

function delkcfhp(id) {
    if (EditKCFHPStore.data.length > 0) {
        for (var i = 0; i < EditKCFHPStore.data.length; i++) {
            if (EditKCFHPStore.data.items[i].data.SP_ID == id) {
                EditKCFHPStore.remove(EditKCFHPStore.data.items[i]);
            }
        }
    }
    Ext.getCmp("KCFHPListPanel").reconfigure(EditKCFHPStore);
}


//************************************弹出界面***************************************

Ext.define('KCFHPList', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 800,
    height: 500,
    layout: {
        type: 'fit'
    },
    title: '可拆分货品',
    id: 'KCFHPListWin',
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
                            id: 'KCFHPListPanel',
                            columnLines: true,
                            store: EditKCFHPStore,
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {
                                    clicksToEdit: 1
                                })
                            ],
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'yundan_goodsName',
                                    flex: 1,
                                    text: "货品名称",
                                    menuDisabled: true,
                                    sortable: false
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'yundan_goodsPack',
                                    flex: 1,
                                    text: '包装',
                                    menuDisabled: true,
                                    sortable: false

                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'yundan_goodsAmount',
                                    flex: 1,
                                    text: '件数',
                                    menuDisabled: true,
                                    sortable: false,
                                    field: {
                                        xtype: 'numberfield',
                                        decimalPrecision: 0,
                                        selectOnFocus: true,
                                        allowDecimals: false
                                    },
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var v = 0;
                                        for (var i = 0; i < KCFHPStore.data.length; i++) {
                                            if (KCFHPStore.data.items[i].data.SP_ID == record.data.SP_ID) {
                                                var yundan_goodsAmount = KCFHPStore.data.items[i].data.yundan_goodsAmount;
                                                if (value > 0) {
                                                    if (yundan_goodsAmount < value) {
                                                        Ext.Msg.alert('提示', "件数不能大于" + yundan_goodsAmount + "！");
                                                        v = yundan_goodsAmount;
                                                    } else {
                                                        v = value;
                                                    }
                                                } else {
                                                    Ext.Msg.alert('提示', "件数必须大于0！");
                                                    v = yundan_goodsAmount;
                                                }
                                            }
                                        }
                                        cellmeta.style = 'background: #99CCFF ';
                                        return v;
                                    }

                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'yundan_goodsWeight',
                                    flex: 1,
                                    text: '重量',
                                    menuDisabled: true,
                                    sortable: false,
                                    field: {
                                        xtype: 'numberfield',
                                        decimalPrecision: 6,
                                        selectOnFocus: true
                                    },
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var v = 0;
                                        for (var i = 0; i < KCFHPStore.data.length; i++) {
                                            if (KCFHPStore.data.items[i].data.SP_ID == record.data.SP_ID) {
                                                var yundan_goodsWeight = KCFHPStore.data.items[i].data.yundan_goodsWeight;
                                                if (value > 0) {
                                                    if (yundan_goodsWeight < value) {
                                                        Ext.Msg.alert('提示', "重量不能大于" + yundan_goodsWeight + "！");
                                                        v = yundan_goodsWeight;
                                                    } else {
                                                        v = value;
                                                    }
                                                } else {
                                                    Ext.Msg.alert('提示', "重量必须大于0！");
                                                    v = yundan_goodsWeight;
                                                }
                                            }
                                        }
                                        cellmeta.style = 'background: #99CCFF ';
                                        return v;
                                    }
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'yundan_goodsVolume',
                                    flex: 1,
                                    text: '体积',
                                    menuDisabled: true,
                                    sortable: false,
                                    field: {
                                        xtype: 'numberfield',
                                        decimalPrecision: 6,
                                        selectOnFocus: true
                                    },
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        var v = 0;
                                        for (var i = 0; i < KCFHPStore.data.length; i++) {
                                            if (KCFHPStore.data.items[i].data.SP_ID == record.data.SP_ID) {
                                                var yundan_goodsVolume = KCFHPStore.data.items[i].data.yundan_goodsVolume;
                                                if (value > 0) {
                                                    if (yundan_goodsVolume < value) {
                                                        Ext.Msg.alert('提示', "体积不能大于" + yundan_goodsVolume + "！");
                                                        v = yundan_goodsVolume;
                                                    } else {
                                                        v = value;
                                                    }
                                                } else {
                                                    Ext.Msg.alert('提示', "体积必须大于0！");
                                                    v = yundan_goodsVolume;
                                                }
                                            }
                                        }
                                        cellmeta.style = 'background: #99CCFF ';
                                        return v;
                                    }

                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'SP_ID',
                                    sortable: false,
                                    menuDisabled: true,
                                    text: '操作',
                                    width: 100,
                                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                        return "<a href='JavaScript:void(0)' onclick='delkcfhp(\"" + value + "\")'>删除</a>";
                                    }
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'buttongroup',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'save',
                                                    text: '确认',
                                                    handler: function () {
                                                        HPStore.removeAll();
                                                        for (var i = 0; i < EditKCFHPStore.getCount() ; i++) {
                                                            HPStore.add(EditKCFHPStore.getAt(i));
                                                        }
                                                        return;
                                                        var me = this;
                                                        Ext.Msg.show({
                                                            title: '提示',
                                                            msg: '保存成功!',
                                                            buttons: Ext.MessageBox.OK,
                                                            icon: Ext.MessageBox.INFO,
                                                            fn: function () {
                                                                EditKCFHPStore.removeAll();
                                                                me.up('window').close();
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        }
                                    ]
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

//************************************弹出界面***************************************


Ext.onReady(function () {
    Ext.define('CFYD', {
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
                                                    var hplist = [];
                                                    for (var i = 0; i < HPStore.data.items.length; i++) {
                                                        hplist.push(HPStore.data.items[i].data);
                                                    }

                                                    if (isleaf == 0) {
                                                        CS('CZCLZ.YDMag.SaveCF2', function (retVal) {
                                                            if (retVal) {
                                                                Ext.Msg.show({
                                                                    title: '提示',
                                                                    msg: '保存成功!',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO,
                                                                    fn: function () {

                                                                        FrameStack.popFrame();
                                                                    }
                                                                });
                                                            }

                                                        }, CS.onError, ydid, Ext.getCmp("oldyundanNum").getValue(), Ext.getCmp("newyundanNum").getValue(), hplist);
                                                    } else if (isleaf == 1) {
                                                        CS('CZCLZ.ZCDMag.SaveCF2', function (retVal) {
                                                            if (retVal) {
                                                                Ext.Msg.show({
                                                                    title: '提示',
                                                                    msg: '保存成功!',
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO,
                                                                    fn: function () {

                                                                        FrameStack.popFrame();
                                                                    }
                                                                });
                                                            }

                                                        }, CS.onError, ydid, cfid, Ext.getCmp("oldyundanNum").getValue(), Ext.getCmp("newyundanNum").getValue(), hplist);
                                                    }

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
                                                iconCls: 'close',
                                                text: '返回',
                                                handler: function () {
                                                    FrameStack.popFrame();
                                                }
                                            },

                                        ]
                                    },
                                    { xtype: "displayfield", value: "注：运单拆分不影响原运单运费！" }
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
                                                name: 'oldyundanNum',
                                                id: 'oldyundanNum',
                                                allowBlank: false,
                                                columnWidth: 0.5,
                                                margin: '5 10 5 10',
                                                fieldLabel: '原运单号',
                                                readOnly: true,
                                                fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                            },
                                            {
                                                xtype: 'textfield',
                                                name: 'newyundanNum',
                                                id: 'newyundanNum',
                                                columnWidth: 0.5,
                                                margin: '5 10 5 10',
                                                fieldLabel: '拆出新运单号',
                                                allowBlank: false,
                                                readOnly: true,
                                                fieldStyle: 'color:#999999; background-color: #E6E6E6; background-image: none;'
                                            }
                                        ]
                                    }
                                ]

                            },
                            {
                                xtype: 'panel',
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
                                        store: HPStore,
                                        columnLines: true,
                                        columns: [
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goodsName',
                                                format: 'Y-m',
                                                flex: 1,
                                                text: "货品名称",
                                                menuDisabled: true,
                                                sortable: false
                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goodsPack',
                                                flex: 1,
                                                text: '包装',
                                                menuDisabled: true,
                                                sortable: false

                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goodsAmount',
                                                flex: 1,
                                                text: '件数',
                                                menuDisabled: true,
                                                sortable: false

                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goodsWeight',
                                                flex: 1,
                                                text: '重量',
                                                menuDisabled: true,
                                                sortable: false
                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'yundan_goodsVolume',
                                                flex: 1,
                                                text: '体积',
                                                menuDisabled: true,
                                                sortable: false
                                            },
                                            {
                                                xtype: 'gridcolumn',
                                                dataIndex: 'SP_ID',
                                                sortable: false,
                                                menuDisabled: true,
                                                text: '操作',
                                                width: 200,
                                                renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                                                    return "<a href='JavaScript:void(0)' onclick='delhp(\"" + value + "\")'>删除</a>";
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
                                                        xtype: 'buttongroup',
                                                        title: '',
                                                        items: [
                                                            {
                                                                xtype: 'button',
                                                                iconCls: 'add',
                                                                text: '新增',
                                                                handler: function () {
                                                                    if (isleaf == 0) {
                                                                        CS('CZCLZ.YDMag.GetHPByYD2', function (retVal) {
                                                                            if (retVal) {
                                                                                KCFHPStore.loadData(retVal);
                                                                                EditKCFHPStore.loadData(retVal);
                                                                                var win = new KCFHPList();
                                                                                win.show();
                                                                            }
                                                                        }, CS.onError, ydid, Ext.getCmp("oldyundanNum").getValue());
                                                                    } else if (isleaf == 1) {
                                                                        CS('CZCLZ.ZCDMag.GetHPByYD2', function (retVal) {
                                                                            if (retVal) {
                                                                                KCFHPStore.loadData(retVal);
                                                                                EditKCFHPStore.loadData(retVal);
                                                                                var win = new KCFHPList();
                                                                                win.show();
                                                                            }
                                                                        }, CS.onError, cfid);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
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
    new CFYD();

    if (cfid) {
        CS('CZCLZ.ZCDMag.GetYDNum', function (retVal) {
            if (retVal) {
                ydid = retVal.ydid;
                isleaf = retVal.isleaf;
                Ext.getCmp("oldyundanNum").setValue(retVal.oldyundanNum);
                Ext.getCmp("newyundanNum").setValue(retVal.newyundanNum);
            }
        }, CS.onError, cfid);

    } else {
    }
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

