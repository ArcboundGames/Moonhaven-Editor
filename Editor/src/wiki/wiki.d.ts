interface WikiOptions {
  bot: 0 | 1;
  nocreate?: 0 | 1;
  minor?: 0 | 1;
  summary?: string;
}

declare module 'wikiapi' {
  class Wikiapi {
    constructor(url: string);

    login(username: string, password: string): Promise<void>;

    page(pageName: string): Promise<{
      wikitext: string;
    }>;

    edit(content: (pageContent: string) => string, options: WikiOptions): Promise<void>;

    edit_page(title: string, content: (pageContent: string) => string, options: WikiOptions): Promise<void>;

    upload(
      options: WikiOptions & {
        file_path: string;
        filename: string;
        comment: string;
        ignorewarnings: 0 | 1;
      }
    ): Promise<void>;

    purge(title: string, options: WikiOptions): Promise<void>;
  }
  export default Wikiapi;
}
