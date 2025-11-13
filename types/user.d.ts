interface UserInfo {
    userId: number;
    userName: string | null;
    userEmail: string | null;
    userAge: number | null;
    userAlias: string | null;
    wxOpenId: string | null;
    wxUnionId: string | null;
    wxAvatarUrl: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    createBy?: number | null;
    updateBy?: number | null;
}