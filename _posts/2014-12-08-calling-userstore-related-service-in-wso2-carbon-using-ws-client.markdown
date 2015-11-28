---
layout: post
title: Calling UserStore related service in WSO2 Carbon using WS-Client
date: 2014-12-08 20:45:46 -0800
comments: true
category: wso2
disqus: y
share: y
tags:
- ws-client
- backend
- user-store
- wso2-is
---
WSO2 Carbon Servers expose all functionalities as Web-Services. In fact the WSO2 Management console is one such web app that utilize the Web services to build a comprehensive management console. Such services are called as Admin Services. 

We are going to use the API to list the users of a provided role using a Java based web-service client (WS-Client). WSO2 has a set of [service stubs](https://svn.wso2.org/repos/wso2/carbon/platform/trunk/service-stubs/) released that can be used get this done. 

The other option is to use the WSDL (Web Service Descriptor) to generate the stubs. WSDLs of the Admin Services are hidden by default. To enable them - change the flag in the carbon.xml - `<HideAdminServiceWSDLs>false</HideAdminServiceWSDLs>`

After that you can view the Admin Services deployed on the server by starting the server on OSGi mode. To start with OSGi mode run - `sh bin/wso2server.sh -DosgiConsole`. Once the server finished booting up you can execute - `listAdminServices`.
<!-- more -->
## Creating the Maven Project
Next thing we want to do is to create the maven project which has all the necessary dependencies. Below section needs to be added to the pom.xml file. 

``` xml
<repositories>
        <repository>
            <id>wso2-nexus</id>
            <name>WSO2 internal Repository</name>
            <url>http://maven.wso2.org/nexus/content/groups/wso2-public/</url>
            <releases>
                <enabled>true</enabled>
                <updatePolicy>daily</updatePolicy>
                <checksumPolicy>fail</checksumPolicy>
            </releases>
        </repository>
    </repositories>
    <dependencies>
        <dependency>
            <groupId>org.wso2.carbon</groupId>
            <artifactId>org.wso2.carbon.authenticator.stub</artifactId>
            <version>4.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.wso2.carbon</groupId>
            <artifactId>org.wso2.carbon.um.ws.api.stub</artifactId>
            <version>4.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.wso2.carbon</groupId>
            <artifactId>org.wso2.carbon.user.mgt.stub</artifactId>
            <version>4.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.axis2.wso2</groupId>
            <artifactId>axis2-client</artifactId>
            <version>1.6.1.wso2v5</version>
        </dependency>
    </dependencies>
```

Admin Services are protected with Basic Authentication. To call the UserStore related Services - I first need an authorized cookie. I am going to call the Authentication Endpoint to obtain the authorized cookie. 

``` java
public class LoginAdminServiceClient {
    private final String serviceName = "AuthenticationAdmin";
    private AuthenticationAdminStub authenticationAdminStub;
    private String endPoint;

    public LoginAdminServiceClient(String backEndUrl) throws AxisFault {
        this.endPoint = backEndUrl + "/services/" + serviceName;
        authenticationAdminStub = new AuthenticationAdminStub(endPoint);
    }

    public String authenticate(String userName, String password)
            throws RemoteException, LoginAuthenticationExceptionException {

        String sessionCookie = null;

        if (authenticationAdminStub.login(userName, password, "localhost")) {
            System.out.println("Login Successful");

            ServiceContext serviceContext = authenticationAdminStub
                    ._getServiceClient().getLastOperationContext()
                    .getServiceContext();
            sessionCookie = (String) serviceContext
                    .getProperty(HTTPConstants.COOKIE_STRING);
            System.out.println(sessionCookie);
        }

        return sessionCookie;
    }

    public void logOut() throws RemoteException,
            LogoutAuthenticationExceptionException {
        authenticationAdminStub.logout();
    }

} 
```

When we call the `authenticate()` method with user credentials - we get a return of the authenticated cookie. Next I am going to call the service method that returns me all the user that belongs to a role. 

``` java
public class ServiceAdminClient {
	private UserAdminStub userAdminStub;
	private RemoteUserStoreManagerServiceStub remoteUMStub;

	public ServiceAdminClient(String backEndUrl, String sessionCookie)
			throws AxisFault { 
		String userAdminEndpoint = createUserAdminEndpoint(backEndUrl);
		String remoteUserStoreEndpoint = createRemoteUserStoreEndpoint(backEndUrl);
		
		userAdminStub = new UserAdminStub(userAdminEndpoint);
		remoteUMStub = new RemoteUserStoreManagerServiceStub(remoteUserStoreEndpoint);
		// Authenticate Your stub from sessionCookie
		createUserAdminClient(sessionCookie);
		createRemoteUserStoreClient(sessionCookie);
	}
	private void createClient(ServiceClient serviceClient, String sessionCookie){
		Options option;
		option = serviceClient.getOptions();
		option.setManageSession(true);
		option.setProperty(
				org.apache.axis2.transport.http.HTTPConstants.COOKIE_STRING,
				sessionCookie);
	}
	private void createUserAdminClient(String sessionCookie) {
		ServiceClient serviceClient = userAdminStub._getServiceClient();
		createClient(serviceClient, sessionCookie);
	}
	private void createRemoteUserStoreClient(String sessionCookie) {
		ServiceClient serviceClient = remoteUMStub._getServiceClient();
		createClient(serviceClient, sessionCookie);
	}
	private String createUserAdminEndpoint(String backEndUrl) {
		return backEndUrl + "/services/" + "UserAdmin";
	}
	private String createRemoteUserStoreEndpoint(String backEndUrl) {
		return backEndUrl + "/services/" + "RemoteUserStoreManagerService";
	}
	
	public String[] getUsersOfRole(String role) throws RemoteException, RemoteUserStoreManagerServiceUserStoreExceptionException{
		return remoteUMStub.getUserListOfRole(role);
	}
}
```

In the above class - we have created a method called `getUsersOfRole()` which calls an existing method in the stub. 

Below is a code block that utilize the above created `ServiceAdminClient` class to print the list of users for a role.

``` java
public class LoginAdminServiceClient {
    private final String serviceName = "AuthenticationAdmin";
    private AuthenticationAdminStub authenticationAdminStub;
    private String endPoint;

    public LoginAdminServiceClient(String backEndUrl) throws AxisFault {
        this.endPoint = backEndUrl + "/services/" + serviceName;
        authenticationAdminStub = new AuthenticationAdminStub(endPoint);
    }

    public String authenticate(String userName, String password)
            throws RemoteException, LoginAuthenticationExceptionException {

        String sessionCookie = null;

        if (authenticationAdminStub.login(userName, password, "localhost")) {
            System.out.println("Login Successful");

            ServiceContext serviceContext = authenticationAdminStub
                    ._getServiceClient().getLastOperationContext()
                    .getServiceContext();
            sessionCookie = (String) serviceContext
                    .getProperty(HTTPConstants.COOKIE_STRING);
            System.out.println(sessionCookie);
        }

        return sessionCookie;
    }

    public void logOut() throws RemoteException,
            LogoutAuthenticationExceptionException {
        authenticationAdminStub.logout();
    }

} 
```

## Conclusion
`org.wso2.carbon.um.ws.api.stub` is one such stub that can be perform operations available in WSO2 Components. A custom app can be used to build and register users using the services available.