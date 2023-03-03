export interface edit_props{
	close: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface edit_user {
    login: string | null;
    password: string | null;
    email: string | null;
    info: string | null;
}
