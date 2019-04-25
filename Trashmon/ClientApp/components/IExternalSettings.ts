interface IExternalSettings
{
    Urls: IExternalSettingsUrls;
    Token: string;
    
    User?: IUser;
    Organization: IOrganization;
    Settings: {};
}

interface IExternalSettingsUrls {
    Service: string;
    Relative: string;
    Content: string
    Image: string;
}

interface IUser {
    ID: number;
    UID: string;
    Name: string;
    Login: string;
    Mail: string;
}

interface IOrganization {
    ID: number;
    UID: string;
    Name: string;
}