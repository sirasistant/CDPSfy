## CDPSfy

### Dependencies

- node.js
- npm

### How to install

<pre>
git clone https://github.com/aalonsog/CDPSfy.git
cd CDPSfy
npm install
</pre>

### How to configure

+ The server is configured to listen in port 8080. You can modify that folder using the env variable 'PORT'

+ The project is configured to serve and create audio files in folder 'CDPSfy/media/'.

You can modify that folder using the env variable 'TRACKS_DIR'

For instance:
<pre>
export TRACKS_DIR=/home/ubuntu/my/static/media/folder
</pre>



### How to run

<pre>
sudo npm start
</pre>

#### Default music: http://www.bensound.com
