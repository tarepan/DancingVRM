# DancingVRM: Your avator dance on the Web


Unity  
WASM出力  
VRoidSDK (waiting for public API)  

ブラウザ入力  
Unity側受け取り  

1. txt入力test  
2. VRM dynamic import
3. Dancing

## htmlとUnity WebGLの合わせ技
**UnityLoader**と**gameInstance**が鍵.  
ともにJS Objectで、こいつを使ってUnityアプリ部を生成、管理する.  
[Using WebGL Templates](https://docs.unity3d.com/2018.3/Documentation/Manual/webgl-templates.html)  


[WebGL: Interacting with browser scripting](https://docs.unity3d.com/2018.3/Documentation/Manual/webgl-interactingwithbrowserscripting.html)  

### Unity WebGLビルド
特定の文字列がBuild時に置換 (textContentだったり、URLだったり)  

* UNITY_WEB_NAME: Name of the player.
* UNITY_WEBGL_LOADER_URL: URL of the UnityLoader.js script, which performs instantiation of the build.
* UNITY_WEBGL_BUILD_URL: URL of the JSON file, containing all the necessary information about the build.
* UNITY_WIDTH and UNITY_HEIGHT: Onscreen width and height of the player in pixels.
* UNITY_CUSTOM_SOME_TAG: I


## UnityLoader
UnityLoaderの詳細が出てこない.  
ビルドしてみてみよう.  
[参考コード](https://gist.github.com/kyptov/f7e4718ee93b5c42bb975bc006fb10b4)


* index.html
* TemplateData (if "default template")
* Build
  + UnityLoader.js
  + MyProject.json
