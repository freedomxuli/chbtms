using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SmartFramework4v2.Web.WebExecutor;
using System.Data;
using SmartFramework4v2.Data.SqlServer;
using System.Text;
using System.Data.SqlClient;
using SmartFramework4v2.Web.Common.JSON;

/// <summary>
///JsMag 的摘要说明
/// </summary>
[CSClass("JsGlClass")]
public class JsMag
{
    public JsMag()
    {
        //
        //TODO: 在此处添加构造函数逻辑
        //
    }

    [CSMethod("SaveJs")]
    public object SaveJs(JSReader jsr, string zt)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;
        using (DBConnection dbc = new DBConnection())
        {
            string lbmc = jsr["JS_NAME"];
            if (lbmc == "")
            {
                throw new Exception("角色名称不能为空！");
            }

            string jsxh = jsr["JS_PX"];
            if (jsxh == "")
            {
                throw new Exception("角色序号不能为空！");
            }

            if (jsr["JS_ZT"] == "")
            {
                throw new Exception("角色状态出错！");
            }

            if (jsr["JS_Type"] == "")
            {
                throw new Exception("角色类别出错！");
            }

            int jszt = jsr["JS_ZT"].ToInteger();

            if (jsr["JS_ID"].ToString() == "")
            {
                //新增
                string jsid = Guid.NewGuid().ToString();

                var dt = dbc.GetEmptyDataTable("tb_b_JS");
                var sr = dt.NewRow();
                sr["JS_ID"] = new Guid(jsid);
                sr["JS_NAME"] = lbmc;
                sr["JS_PX"] = jsr["JS_PX"].ToInteger();
                sr["JS_Type"] = jsr["JS_Type"].ToInteger();
                sr["JS_ZT"] = jszt;
                sr["status"] = false;
                sr["updatetime"] = DateTime.Now;
                sr["addtime"] = DateTime.Now;
                sr["updateuser"] = userid;
                dt.Rows.Add(sr);
                dbc.InsertTable(dt);
            }
            else
            {
                //修改
                string jsid = jsr["JS_ID"].ToString();
                var dt = dbc.GetEmptyDataTable("tb_b_JS");
                var dtt = new SmartFramework4v2.Data.DataTableTracker(dt);
                var sr = dt.NewRow();
                sr["JS_ID"] = new Guid(jsid);
                sr["JS_NAME"] = lbmc;
                sr["JS_PX"] = jsr["JS_PX"].ToInteger();
                sr["JS_Type"] = jsr["JS_Type"].ToInteger();
                sr["JS_ZT"] = jszt;
                sr["updatetime"] = DateTime.Now;
                sr["updateuser"] = userid;
                dt.Rows.Add(sr);
                dbc.UpdateTable(dt, dtt);
            }

            return GetJs(zt);
        }
    }

    [CSMethod("GetJs")]
    public object GetJs(string zt)
    {
        using (DBConnection dbc = new DBConnection())
        {
            try
            {
                string where = "";
                if (!string.IsNullOrEmpty(zt) && zt != "")
                {
                    where = " and JS_ZT=@JS_ZT ";
                }

                string sql = "select * from tb_b_JS where status=0 ";
                sql += where;
                sql += " order by JS_PX";

                SqlCommand ocmd = new SqlCommand(sql);
                if (!string.IsNullOrEmpty(zt) && zt != "")
                {
                    ocmd.Parameters.AddWithValue("@JS_ZT", zt);
                }

                DataTable dt = dbc.ExecuteDataTable(ocmd);
                return dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }

    [CSMethod("DeleteJs")]
    public object DeleteJs(JSReader jsr, string zt)
    {
        var user = SystemUser.CurrentUser;
        string userid = user.UserID;

        using (DBConnection dbc = new DBConnection())
        {
            dbc.BeginTransaction();
            try
            {
                for (int i = 0; i < jsr.ToArray().Length; i++)
                {
                    //判断角色是否被用户关联就不能删除
                    string str = "select count(*) from tb_b_User_JS_Gl where JS_ID=@JS_ID and delflag=0";
                    SqlCommand ocmd = new SqlCommand(str);
                    ocmd.Parameters.AddWithValue("@JS_ID", jsr.ToArray()[i].ToString());
                    int num = Convert.ToInt32(dbc.ExecuteScalar(ocmd));

                    if (num > 0)
                    {
                        throw new Exception("你所要删除的角色已经被用户关联，请先删除用户再进行此操作！");
                    }
                    else
                    {

                        string delstr = "update tb_b_JS set status=1,updatetime=@updatetime,updateuser=@updateuser where JS_ID=@JS_ID";
                        ocmd = new SqlCommand(delstr);
                        ocmd.Parameters.AddWithValue("updatetime", DateTime.Now);
                        ocmd.Parameters.AddWithValue("updateuser", userid);
                        ocmd.Parameters.AddWithValue("JS_ID", jsr.ToArray()[i].ToString());
                        dbc.ExecuteNonQuery(ocmd);

                    }

                }

                dbc.CommitTransaction();

                return GetJs(zt);
            }
            catch (Exception ex)
            {
                dbc.RoolbackTransaction();
                throw ex;
            }
        }
    }
}
