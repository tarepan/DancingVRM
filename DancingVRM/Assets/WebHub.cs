using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using VRM;

public class WebHub : MonoBehaviour
{
    // Start is called before the first frame update
    int cnt = 0;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        cnt++;
        if (false /*cnt == 200*/){
            // var bytes = ReadAllBytes("./models/droid-vrm.vrm");
            // Debug.Log($"raw: {bytes}");
            // var base64str = System.Convert.ToBase64String(bytes);
            // Debug.Log($"base64: {base64str}");
            // SendVRM(base64str);
        }
    }

    void SendVRM(string VRM_base64)
    {
        Debug.Log("SendVRM run");
        Debug.Log($"length: {VRM_base64.Length}");
        Debug.Log($"base64: {VRM_base64}");
        var rawbt = System.Convert.FromBase64String(VRM_base64);
        Debug.Log($"raw: {rawbt}");

        var context = new VRMImporterContext();
        context.ParseGlb(rawbt);
        context.Load();
        var root = context.Root;
        
        root.transform.SetParent(transform, false);

        context.ShowMeshes();
        Debug.Log("finish VRM processes.");
    }
}
