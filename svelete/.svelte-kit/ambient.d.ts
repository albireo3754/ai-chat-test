
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const AWS_ACCESS_KEY_ID: string;
	export const AWS_SECRET_ACCESS_KEY: string;
	export const AWS_REGION: string;
	export const NVM_INC: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const GEMINI_CLI_IDE_WORKSPACE_PATH: string;
	export const _P9K_TTY: string;
	export const NVM_CD_FLAGS: string;
	export const SHELL: string;
	export const TERM: string;
	export const INFLUXDB_ADMIN_USER_TOKEN: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const CONDA_SHLVL: string;
	export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
	export const TERM_PROGRAM_VERSION: string;
	export const INFLUXDB_BASE_DIR: string;
	export const CONDA_PROMPT_MODIFIER: string;
	export const INFLUXDB_DB: string;
	export const ZDOTDIR: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const MallocNanoZone: string;
	export const TERM_SESSION_ID: string;
	export const npm_config_local_prefix: string;
	export const ENABLE_IDE_INTEGRATION: string;
	export const ZSH: string;
	export const INFLUXDB_HTTP_AUTH_ENABLED: string;
	export const USER: string;
	export const NVM_DIR: string;
	export const COMMAND_MODE: string;
	export const CONDA_EXE: string;
	export const CLAUDE_CODE_SSE_PORT: string;
	export const SSH_AUTH_SOCK: string;
	export const VSCODE_PROFILE_INITIALIZED: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const BUN_WHICH_IGNORE_CWD: string;
	export const PAGER: string;
	export const LSCOLORS: string;
	export const PATH: string;
	export const DISCORD_TOKEN: string;
	export const npm_package_json: string;
	export const _: string;
	export const LaunchInstanceID: string;
	export const JOBS: string;
	export const USER_ZDOTDIR: string;
	export const CONDA_PREFIX: string;
	export const __CFBundleIdentifier: string;
	export const INFLUXDB_REPORTING_DISABLED: string;
	export const PWD: string;
	export const VSCODE_NONCE: string;
	export const P9K_SSH: string;
	export const npm_package_name: string;
	export const P9K_TTY: string;
	export const LANG: string;
	export const ITERM_PROFILE: string;
	export const BUN_INSPECT_CONNECT_TO: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const XPC_FLAGS: string;
	export const INFLUXDB_ADMIN_USER: string;
	export const BINANCE_TOP_LEVEL_DOMAIN: string;
	export const INFLUXDB_ADMIN_USER_PASSWORD: string;
	export const BINANCE_API_SECRET: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const VSCODE_INJECTION: string;
	export const COLORFGBG: string;
	export const HOME: string;
	export const SHLVL: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const BINANCE_API_KEY: string;
	export const LC_TERMINAL_VERSION: string;
	export const HOMEBREW_PREFIX: string;
	export const ITERM_SESSION_ID: string;
	export const INFLUX_PORT: string;
	export const LESS: string;
	export const LOGNAME: string;
	export const CONDA_PYTHON_EXE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const GEMINI_CLI_IDE_SERVER_PORT: string;
	export const NVM_BIN: string;
	export const BUN_INSTALL: string;
	export const CONDA_DEFAULT_ENV: string;
	export const npm_config_user_agent: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const GIT_ASKPASS: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const LC_TERMINAL: string;
	export const OBSIDIAN_API_KEY: string;
	export const SECURITYSESSIONID: string;
	export const npm_node_execpath: string;
	export const COLORTERM: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		AWS_ACCESS_KEY_ID: string;
		AWS_SECRET_ACCESS_KEY: string;
		AWS_REGION: string;
		NVM_INC: string;
		TERM_PROGRAM: string;
		NODE: string;
		INIT_CWD: string;
		GEMINI_CLI_IDE_WORKSPACE_PATH: string;
		_P9K_TTY: string;
		NVM_CD_FLAGS: string;
		SHELL: string;
		TERM: string;
		INFLUXDB_ADMIN_USER_TOKEN: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		CONDA_SHLVL: string;
		VSCODE_PYTHON_AUTOACTIVATE_GUARD: string;
		TERM_PROGRAM_VERSION: string;
		INFLUXDB_BASE_DIR: string;
		CONDA_PROMPT_MODIFIER: string;
		INFLUXDB_DB: string;
		ZDOTDIR: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		MallocNanoZone: string;
		TERM_SESSION_ID: string;
		npm_config_local_prefix: string;
		ENABLE_IDE_INTEGRATION: string;
		ZSH: string;
		INFLUXDB_HTTP_AUTH_ENABLED: string;
		USER: string;
		NVM_DIR: string;
		COMMAND_MODE: string;
		CONDA_EXE: string;
		CLAUDE_CODE_SSE_PORT: string;
		SSH_AUTH_SOCK: string;
		VSCODE_PROFILE_INITIALIZED: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		BUN_WHICH_IGNORE_CWD: string;
		PAGER: string;
		LSCOLORS: string;
		PATH: string;
		DISCORD_TOKEN: string;
		npm_package_json: string;
		_: string;
		LaunchInstanceID: string;
		JOBS: string;
		USER_ZDOTDIR: string;
		CONDA_PREFIX: string;
		__CFBundleIdentifier: string;
		INFLUXDB_REPORTING_DISABLED: string;
		PWD: string;
		VSCODE_NONCE: string;
		P9K_SSH: string;
		npm_package_name: string;
		P9K_TTY: string;
		LANG: string;
		ITERM_PROFILE: string;
		BUN_INSPECT_CONNECT_TO: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		XPC_FLAGS: string;
		INFLUXDB_ADMIN_USER: string;
		BINANCE_TOP_LEVEL_DOMAIN: string;
		INFLUXDB_ADMIN_USER_PASSWORD: string;
		BINANCE_API_SECRET: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		VSCODE_INJECTION: string;
		COLORFGBG: string;
		HOME: string;
		SHLVL: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		BINANCE_API_KEY: string;
		LC_TERMINAL_VERSION: string;
		HOMEBREW_PREFIX: string;
		ITERM_SESSION_ID: string;
		INFLUX_PORT: string;
		LESS: string;
		LOGNAME: string;
		CONDA_PYTHON_EXE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		GEMINI_CLI_IDE_SERVER_PORT: string;
		NVM_BIN: string;
		BUN_INSTALL: string;
		CONDA_DEFAULT_ENV: string;
		npm_config_user_agent: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		GIT_ASKPASS: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		LC_TERMINAL: string;
		OBSIDIAN_API_KEY: string;
		SECURITYSESSIONID: string;
		npm_node_execpath: string;
		COLORTERM: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
