export default function Widget() {
	return (
	  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#4c1d95] to-[#164e63] text-primary-foreground">
		<div className="bg-card p-8 rounded-lg shadow-md w-full max-w-md">
		  <div className="flex justify-center items-center mb-6">
			<img undefinedhidden="true" alt="chess-queen" src="https://openui.fly.dev/openui/48x48.svg?text=♛" className="h-12 w-12 bg-gradient-to-br from-[#4c1d95] to-[#164e63] rounded-full p-1" />
			<h2 className="text-3xl font-bold ml-3 bg-gradient-to-br from-[#4c1d95] to-[#164e63] inline-block text-transparent bg-clip-text">Login to MasterChess</h2>
		  </div>
		  <form className="space-y-6">
			<div>
			  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
				Email address
			  </label>
			  <input
				type="email"
				name="email"
				id="email"
				className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
				placeholder="you@example.com"
			  />
			</div>
			<div>
			  <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
				Password
			  </label>
			  <input
				type="password"
				name="password"
				id="password"
				className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
				placeholder="••••••••"
			  />
			</div>
			<div className="flex items-center justify-between">
			  <div className="flex items-center">
				<input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-border rounded" />
				<label htmlFor="remember_me" className="ml-2 block text-sm text-muted-foreground">
				  {' '}
				  Remember me{' '}
				</label>
			  </div>
			  <div className="text-sm">
				<a href="#" className="font-medium text-primary hover:text-primary-foreground">
				  {' '}
				  Forgot your password?{' '}
				</a>
			  </div>
			</div>
			<div>
			  <button
				type="submit"
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
				Sign in
			  </button>
			</div>
		  </form>
		</div>
	  </div>
	)
  }