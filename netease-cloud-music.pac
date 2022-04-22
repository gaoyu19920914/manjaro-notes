function FindProxyForURL( url, host ) {
    // Default to using no proxy.
    var ProxyConfig = "DIRECT";

    if( dnsDomainIs( host, "music.163.com" ) ) {
        // Requested domain matches, let's use the proxy.
        ProxyConfig = "PROXY 127.0.0.1:6666";
    }

    return ProxyConfig;
}
