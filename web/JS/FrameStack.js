var FrameStack = {};
FrameStack.pushFrame = function (url) {
    var onClose = null;
    var param = null;
    var title = null;
    var showBackbutton = null;
    var fsWinName = null;
    if (Ext.typeOf(url) == 'object') {
        var p = url;
        url = p.url;
        param = p.param;
        title = p.title;
        showBackbutton = p.showBackbutton;
        onClose = p.onClose;
        fsWinName = p.fsWinName;
    }

    if (arguments.length > 1) {
        if (!Ext.isFunction(arguments[1]))
            param = arguments[1];
        else
            onClose = arguments[1];
    }
    if (!onClose && arguments.length > 2)
        onClose = arguments[2];

    var winDom = window;
    var mw = FrameStack.getMainWindow(fsWinName);
    var orignOverflow = mw.document.body.style.overflow;
    mw.document.body.style.overflow = 'hidden';
    var sz = mw.Ext.getBody().getViewSize();
    var win = new mw.Ext.container.Container({
        resizable: false,
        //header: false,
        modal: false,
        floating: true,
        border: false,
        //closable: false,
        //draggable: false,
        width: sz.width,
        height: sz.height,
        shadow: false,
        //maximized: true,
        onWindowResize: function (w, h) {
            win.setSize(w, h);
        },
        listeners: {
            beforedestroy: function () {
                mw.Ext.EventManager.removeResizeListener(this.onWindowResize, this);
            },
            destroy: function () {
                if (onClose) {
                    var v = this.retVal;
                    setTimeout(function () {
                        onClose.call(winDom, v);
                    }, 1);
                }
                mw.document.body.style.overflow = orignOverflow;
            },
            show: function () {
                mw.Ext.EventManager.onWindowResize(this.onWindowResize, this, { delay: 1 });
                var f = win.getEl().down('iframe');
                f.dom.pw = this;
                this.param = param;
                if (showBackbutton) {
                    mw.Ext.get(win.el.query('.backbt')[0]).on('click', function () {
                        win.destroy();
                    });
                }

            }
        },
        layout: 'fit',
        items: [
            {
                xtype: 'panel',
                title: (showBackbutton ? '<img src="approot/r/Resource/images/back.png" width=16 style="vertical-align:bottom;cursor:pointer;" class="backbt"/>' : "") + (title || ""),
                border: false
            }
        ]

    });

    win.down('panel').update('<iframe frameborder="0" src="' + url + '" style="width:100%;height:100%" />');
    win.show();
};

FrameStack.prepareClose = function(pw){
    window.setTimeout(function () {
        pw.destroy();
    }, 1);
};

FrameStack.popFrame = function (retVal) {
    var pw = FrameStack.getSelfPushFrameWindow();
    var mywin = window;
    if (pw) {
        var parentFrame = FrameStack.findParentIFrame(window);
        var parentWindow = parentFrame.parentWindow;
        parentWindow.setTimeout(function () {
            pw.retVal = retVal;
            parentWindow.FrameStack.prepareClose(pw);
            mywin.location.href = 'about:blank';
        }, 1);
        return true;
    }
    return false;
};

FrameStack.isInFrameStack = function () {
    var pf = FrameStack.findParentIFrame(window);
    return pf && pf.pw;
};

FrameStack.getParam = function () {
    var pw = FrameStack.getSelfPushFrameWindow();
    return pw.param;
};

FrameStack.findParentIFrame = function (win) {
    if (win.parent == win)
        return null;
    var arrFrames = win.parent.document.getElementsByTagName("IFRAME");
    for (var i = 0; i < arrFrames.length; i++) {
        if (arrFrames[i].contentWindow == win) {
            arrFrames[i].parentWindow = win.parent;
            return arrFrames[i];
        }

        //if (arrFrames[i].pw)
        //    return arrFrames[i];
        //else
        //    return null;
    }
};

FrameStack.getSelfPushFrameWindow = function () {
    var pf = FrameStack.findParentIFrame(window);
    if (pf && pf.pw)
        return pf.pw;
};


FrameStack.getMainWindow = function (fsWinName) {
    var curWin = window;
    if (fsWinName && curWin.fsWinName == fsWinName)
        return curWin;
    else if (curWin.isFSMainWin)
        return curWin;
    while (true) {
        var parentFrame = FrameStack.findParentIFrame(curWin);
        if (parentFrame) {
            if (fsWinName) {
                if (parentFrame.parentWindow.fsWinName == fsWinName)
                    return parentFrame.parentWindow;
                else
                    curWin = parentFrame.parentWindow;
            }
            else {
                if (parentFrame.parentWindow.isFSMainWin)
                    return parentFrame.parentWindow;
                else
                    curWin = parentFrame.parentWindow;
            }
        }
        else
            return window;
    }
    return window;
};