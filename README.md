A web spider to download all PDF files in a given link, and the link inside it, and one more.. (You may specify that according to your mood, and ofcourse, requirement).

Installation:

	Clone the repo: 
		git clone https://github.com/GurkiratSinghKang/Node-Spider.git

	Change directory to Node-Spider:
		cd Node-Spider

	Install dependencies:
		npm install

	Run application:
		node app.js

	Open browser:
		localhost:8081


Usage:
	
	1. Enter the url, you want to start crawling with.

	2. Enter the keyword, to narrow down the links visited, which is the substring that must appear in url for spider to visit it.

	3. Specify depth, how deep you want to go.

	4. Click fetch.

Output:
	
	1. All PDF files downloaded to Downloads.

	2. All urls visited listed in urls.txt

	3. All pdfs downloaded listed in pdfs.txt
	
