using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Xml;
using SmartFramework4v2.Data.SqlServer;
using System.Data.SqlClient;
using System.Data;

/// <summary>
///MenuControl 的摘要说明
/// </summary>
public class MenuControl
{
    //<Tab p='Smart.SystemPrivilege.信息采集_平价商店数据.不符合要求的数据统计表' Name='不符合要求的数据统计表'>approot/r/page/jkpt/BFHYQTable.html</Tab>

    //<Tab p='Smart.SystemPrivilege.考核评分_网络监督考核.显示屏联网考核' Name='显示屏联网考核'>approot/r/page/LhKh/XspShow.html</Tab>

//    public static String xmlMenu = @"
//        <MainMenu>
//            <Menu Name='系统维护中心'>
//                <Item Name='角色管理'>
//                    <Tab p='Smart.SystemPrivilege.系统管理_角色管理.角色管理' Name='角色管理'>approot/r/page/UserMag/JsManage.html</Tab>
//                </Item>
//                <Item Name='人员管理'>
//                    <Tab p='Smart.SystemPrivilege.系统管理_人员管理.人员管理' Name='人员管理'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>            
//                
//            </Menu>        
//            <Menu Name='基础档案'>
//                <Item Name='办事处档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_办事处档案.办事处档案' Name='办事处档案'>approot/r/page/JCDA/BSCDA.html</Tab>
//                </Item>
//                <Item Name='线路档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_线路档案.线路档案' Name='线路档案'>approot/r/page/JCDA/XLDA.html</Tab>
//                </Item>  
//                <Item Name='业务员档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_业务员档案.业务员档案' Name='业务员档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>  
//                <Item Name='客户档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_客户档案.客户档案' Name='客户档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>  
//                <Item Name='货品档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_货品档案.货品档案' Name='货品档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>  
//                <Item Name='到达站档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_到达站档案.到达站档案' Name='到达站档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>  
//                <Item Name='大车档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_大车档案.大车档案' Name='大车档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item> 
//                <Item Name='小车档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_小车档案.小车档案' Name='小车档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item> 
//                <Item Name='中转公司档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_中转公司档案.中转公司档案' Name='中转公司档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item> 
//                <Item Name='银行账户'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_银行账户.银行账户' Name='银行账户'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item> 
//                <Item Name='收款项目'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_收款项目.收款项目' Name='收款项目'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>            
//                <Item Name='付款项目'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_付款项目.付款项目' Name='付款项目'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>
//                <Item Name='信用等级档案'>
//                    <Tab p='Smart.SystemPrivilege.基础档案_信用等级档案.信用等级档案' Name='信用等级档案'>approot/r/page/UserMag/UserManage.html</Tab>
//                </Item>
//            </Menu>        
//          
//        </MainMenu>
//    ";

    public static string loadXml()
    {
        using (var db = new DBConnection())
        {
            string roleId = SystemUser.CurrentUser.RoleID;
            string sql_menu = "select b.* from tb_b_menu_role a left join tb_b_menu b on a.menuId = b.menuId where a.roleId = @roleId";
            SqlCommand cmd = db.CreateCommand(sql_menu);
            cmd.Parameters.Add("@roleId", roleId);
            DataTable dt_menu = db.ExecuteDataTable(cmd);

            string sql_module = "select * from tb_b_module where moduleId in (select b.moduleId from tb_b_menu_role a left join tb_b_menu b on a.menuId = b.menuId where a.roleId = @roleId) order by modulePx";
            cmd = db.CreateCommand(sql_module);
            cmd.Parameters.Add("@roleId", roleId);
            DataTable dt_module = db.ExecuteDataTable(cmd);

            string xmlMenu = @"
                    <MainMenu>";

            for (int i = 0; i < dt_module.Rows.Count; i++)
            {
                DataRow[] drs = dt_menu.Select("moduleId = '" + dt_module.Rows[i]["moduleId"].ToString() + "'", "menuPx asc");
                if (drs.Length > 0)
                {
                    xmlMenu += "<Menu Name='" + dt_module.Rows[i]["moduleName"].ToString() + "'>";
                    for (var j = 0; j < drs.Length; j++)
                    {
                        xmlMenu += @"
                                <Item Name='" + drs[j]["menuName"].ToString() + @"'>
                                    <Tab p='" + dt_module.Rows[i]["moduleName"].ToString() + @"." + drs[j]["menuName"].ToString() + @"' Name='" + drs[j]["menuName"].ToString() + @"'>" + drs[j]["menuurl"].ToString() + @"</Tab>
                                </Item>";
                    }
                    xmlMenu += "</Menu>";
                }
            }
            xmlMenu += @"</MainMenu>";

            return xmlMenu;
        }
    }


    public static string GenerateMenuByPrivilege()
    {
        System.Xml.XmlDocument doc = new System.Xml.XmlDocument();
        doc.LoadXml(loadXml());
        StringBuilder sb = new StringBuilder();
        int num = 0;

        var cu = SystemUser.CurrentUser;

        sb.Append("[");
        foreach (System.Xml.XmlElement MenuEL in doc.SelectNodes("/MainMenu/Menu"))
        {
            if (num > 0)
            {
                sb.Append(",");
            }
            num++;

            string title = MenuEL.GetAttribute("Name").ToString().Trim();

            string lis = "";
            foreach (System.Xml.XmlElement ItemEl in MenuEL.SelectNodes("Item"))
            {
                string secname = ItemEl.GetAttribute("Name");
                string msg = "";
                foreach (XmlElement TabEl in ItemEl.SelectNodes("Tab"))
                {
                    string p = TabEl.GetAttribute("p").ToString().Trim();
                    string pantitle = TabEl.GetAttribute("Name").ToString().Trim();
                    string src = TabEl.InnerText;
                    if (msg == "")
                    {
                        msg += pantitle + "," + src;
                    }
                    else
                    {
                        msg += "|" + pantitle + "," + src;
                    }
                }
                if (msg != "")
                {
                    lis += "+ '<li class=\"fore\"><a class=\"MenuItem\" href=\"page/TabMenu.html?msg=" + msg + "\" target=\"mainframe\"><img height=16 width=16 align=\"absmiddle\" style=\"border:0\" src=\"../CSS/images/application.png\" />　" + secname + "</a></li>'";

                }
            }

            if (lis != "")
            {
                sb.Append("{");
                sb.Append("xtype: 'panel',");
                sb.Append("collapsed: false,");
                sb.Append("iconCls: 'cf',");
                sb.Append("title: '" + title + "',");
                sb.Append("html: '<ul class=\"MenuHolder\">'");
                sb.Append(lis);
                sb.Append("+ '</ul>'");
                sb.Append("}");
            }
        }
        sb.Append("]");
        return sb.ToString();
    }
}
