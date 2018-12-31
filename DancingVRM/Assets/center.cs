using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class center : MonoBehaviour
{
    void Start()
    {
    }

    // Update is called once per frame
    void Update()
    {
    }

    void WebInput(int input)
    {
         GetComponent<Renderer>().material.color = Color.red;
         Debug.Log(input);
    }
}
