'***************************************************************************************************************************************'
Sub Main()
'***************************************************************************************************************************************'

    rs = CreateObject("roRegistrySection", "html")
    mp = rs.read("mp")
    if mp <> "1" then
        rs.write("mp","1")
        rs.flush()
        RebootSystem()
    endif

    msgPort = CreateObject("roMessagePort")

    ' configure and create node / htmlWidget
    r = CreateObject("roRectangle", 0,0,1920,1080)

    aa = {}
    aa.AddReplace("nodejs_enabled",true)
    aa.AddReplace("brightsign_js_objects_enabled",true)
    aa.AddReplace("url","file:///sd:/index.html")

    is = {}
    is.AddReplace("port",3000)

    aa.AddReplace("inspector_server",is)

    htmlWidget = CreateObject("roHtmlWidget", r, aa)
    htmlWidget.SetPort(msgPort)
    htmlWidget.show()

    p = CreateObject("roMessagePort")
    htmlWidget.SetPort(p)
    while true
      msg = wait(100, p)
    end while

End Sub
