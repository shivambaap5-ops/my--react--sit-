import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_windows/webview_windows.dart' as win;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My Web App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.blue,
      ),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  // Use dynamic to avoid early initialization/assertion issues on unsupported platforms
  dynamic _controller;
  
  bool _isWindows = false;
  bool _initialized = false;
  String url = 'https://shivambaap5-ops.github.io/my--react--sit-/';

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  Future<void> _initWebView() async {
    try {
      if (!kIsWeb && Platform.isWindows) {
        setState(() {
          _isWindows = true;
        });
        
        final winController = win.WebviewController();
        await winController.initialize();
        await winController.setPopupWindowPolicy(win.WebviewPopupWindowPolicy.deny);
        await winController.setBackgroundColor(Colors.transparent);
        await winController.loadUrl(url);
        
        _controller = winController;
        if (!mounted) return;
        setState(() {
          _initialized = true;
        });
      } else if (!kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
        final mobileController = WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setBackgroundColor(const Color(0x00000000))
          ..loadRequest(Uri.parse(url));
        
        _controller = mobileController;
        setState(() {
          _initialized = true;
        });
      } else {
        setState(() {
          _initialized = true;
        });
      }
    } catch (e) {
      debugPrint('Initialization error: $e');
      if (!mounted) return;
      setState(() {
        _initialized = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    Widget body;

    if (!_initialized) {
      body = const Center(child: CircularProgressIndicator());
    } else if (_isWindows) {
      if (_controller != null && (_controller as win.WebviewController).value.isInitialized) {
        body = win.Webview(_controller as win.WebviewController);
      } else {
        body = const Center(
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Text(
              'Windows WebView initialization failed.\n\nKrupaya he check kara:\n1. WebView2 Runtime install aahe ka?\n2. Developer Mode chalu aahe ka?',
              textAlign: TextAlign.center,
            ),
          ),
        );
      }
    } else if (_controller is WebViewController) {
      body = WebViewWidget(controller: _controller as WebViewController);
    } else {
      body = const Center(
        child: Text('Krupaya he app Mobile var chalu kara,\nkinva browser madhe test kara.'),
      );
    }

    return Scaffold(
      appBar: _isWindows ? AppBar(title: const Text('My App (Desktop)')) : null,
      body: SafeArea(child: body),
    );
  }

  @override
  void dispose() {
    if (_isWindows && _controller != null) {
      (_controller as win.WebviewController).dispose();
    }
    super.dispose();
  }
}
