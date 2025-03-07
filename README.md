-------After Downloading The Project Zip file-------
          ---Step to execute the code--- 

1. Download Xampp Server, VS Code and Node.js

2. Open the XAMPP Installation Directory:
   ----------Navigate to C:\xampp (or wherever XAMPP is installed)., Edit the httpd-vhosts.conf File:
   ----------Go to C:\xampp\apache\conf\extra\httpd-vhosts.conf.
   ----------Open the file in a text editor (e.g., Notepad++).

3.Add a New Virtual Host:
  Add the following code at the bottom of the file:
  
<VirtualHost *:80>
    DocumentRoot "E:/Projects/Video Hosting Platform"
    ServerName video.local
    <Directory "E:/Projects/Video Hosting Platform">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>

Save the httpd-vhosts.conf file.

-------------------------------------------------------------

Step 4: Update the hosts File
Open the hosts File:

Navigate to C:\Windows\System32\drivers\etc\hosts.

Open the file in a text editor (you may need administrator privileges).

Add a New Entry:
Add the following line at the bottom of the file:

Copy
--------- 127.0.0.1 video.local
This maps video.local to your local machine.

Save the hosts file.

------------------------------------------------------------
Step 5: Restart Apache
Open the XAMPP Control Panel.
Restart Apache to apply the changes. 

------------------------------------------------------

Log in as user1 (username: user1, password: pass1) to access videos.
Log in as user2 (username: user2, password: pass2) to verify access is denied.

----------------------------------------------------------

Step 6: Set Up Node.js
Install Node.js:
Download and install Node.js from https://nodejs.org/.

Open a terminal in your project folder and run:

npm init -y
(This creates a package.json file.)

Install Required Packages:

Install express (for the backend) and ejs (for rendering HTML templates):
npm install express ejs
npm install express-session

to run --- node server.js






