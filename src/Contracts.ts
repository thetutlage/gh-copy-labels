export type Org = {
  login: string,
  id: number,
  avatar_url: string,
}

export type Repo = {
  id: number,
  name: string,
  full_name: string,
  private: boolean,
  fork: boolean,
  archived: boolean,
}

export type Label = {
  id: number,
  color: string,
  name: string,
}

export type UserFile = {
  orgs?: Org[],
  repos?: {
    [org: string]: Repo[],
  },
  labels?: {
    [repo: string]: Label[],
  },
}
