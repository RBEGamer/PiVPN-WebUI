var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var express = require('express');
var session = require('express-session');//sessions
var bodyParser = require('body-parser');//sessions
var sessionstore = require('sessionstore'); //sessions
var os = require("os");
var chalk = require('chalk'); //colors in console
var mqtt = require('mqtt'); //mqtt client
var config = require('./config.json'); //include the cofnig file
var uuidv1 = require('uuid/v1'); //gen random uuid times based
var got = require('got');
var randomstring = require("randomstring"); //gen random strings
var fs = require('fs');
var sanitizer = require('sanitizer');
var fileUpload = require('express-fileupload');
var cron = require('node-cron'); //some cronjobs
var listEndpoints = require('express-list-endpoints'); //for rest api explorer
var bcrypt = require('bcrypt'); //for pw hash
var autossh = require('autossh');
var shell = require('shelljs');

var eol = require("eol");

var port = process.env.PORT || config.webserver_default_port || 3000;
var hostname = process.env.HOSTNAME || config.hostname || "http://127.0.0.1:" + port + "/";
var appDirectory = require('path').dirname(process.pkg ? process.execPath : (require.main ? require.main.filename : process.argv[0]));
console.log(appDirectory);





//-------- EXPRESS APP SETUP --------------- //
app.set('trust proxy', 1);
app.use(function (req, res, next) {
    if (!req.session) {
        return next(); //handle error
    }
    next(); //otherwise continue
});
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'damdkfgnlesfkdgjerinsmegwirhlnks.m',
    store: sessionstore.createSessionStore(),
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(fileUpload());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
// ---------------- END EXPRESS SETUP -------------- //

var autossh_tunnel_instance = null;
var tunnel_instance_config = null;
var tn_msg = "";
function open_ssh_tunnel(){
    autossh_tunnel_instance = autossh({

        host: config.pivpn_remote_tunnel_server_ip,
        username: config.pivpn_remote_tunnel_server_ssh_user,

        localPort: config.pivpn_ovpn_local_port,
        remotePort: config.pivpn_ovpn_remote_tunnel_port,

        reverse: true

    }).on('error', err => {
        console.error('ERROR: ', err);
        autossh_tunnel_instance.str_err = err;

    }).on('connect', connection => {
        console.log('Tunnel established on port ' + connection.localPort);
        tn_msg = 'Tunnel established on port ' + connection.localPort;
        console.log('pid: ' + connection.pid);
        tunnel_instance_config = config;
        autossh_tunnel_instance.str_err = 'Tunnel established on port ' + connection.localPort;
    });
    
}

if (config.activate_ssh_tunnel){
    open_ssh_tunnel();
}




function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}





//--------END HELPER FUNCTIONS ---------------//
var sess;






app.get('/', function (req, res) {
    res.redirect('/index');
});

app.get('/index', function (req, res) {
    res.render('index.ejs', {
        app_name: config.app_name
    });
});


//SET IP AND PORT
//GET PUBLIC SSH KEY


app.get('/rest/config', function (req, res) {
        res.json(config);
});


app.get('/rest/tunnel_status', function (req, res) {
    res.json({ "status": tn_msg+ " |||" + JSON.stringify(autossh_tunnel_instance), "config": tunnel_instance_config});
});

app.get('/rest/get_active_client_status', function (req, res) {
    res.json({ "count": get_active_client_status()});
});


app.get('/rest/get_ssh_id', function (req, res) {

    fs.readFile(config.ssh_public_key, 'utf8', function (err, contents) {
        if(err){
            res.json({ key: 'cant read file: ' + String(err) });
            return;
        }
        res.json({ key: '' + String(contents) });
    });
  
});


app.get('/rest/kill_tunnel', function (req, res) {
    if (autossh_tunnel_instance == null){
        res.json({"status":"standby; please wait for tunnel restart"});
        return;
    }
    
    autossh_tunnel_instance.kill();
    autossh_tunnel_instance = null;

    res.json({ "status": "killed; please wait for tunnel restart" });

});





app.get('/rest/get_ocpn_configs', function (req, res) {
    var cfgs = [];
    var found_files = getFiles(config.pivpn_ovpns_dir);
    for(var i = 0; i < found_files.length;i++){
        if (String(found_files[i]).endsWith('_modified.ovpn')){
           continue;
        } else if (String(found_files[i]).endsWith('.ovpn')) {
            cfgs.push({ 'id': path.basename(String(found_files[i]).substring(0, String(found_files[i]).length - 5)), 'file': path.basename(String(found_files[i]))});
        }else{
            continue;
        }
    }
    res.json({ cfgs: cfgs});
});





app.get('/rest/create_new_ovpn_client/:id', function (req, res) {
    var id = req.params.id;
    id = sanitizer.sanitize(id);
    if (id != null || String(id).length > 0){
        var result = shell.exec('pivpn -a nopass -n ' + String(id) + ' -d 1080 ');
        console.log(result);

        res.json({ "res": result });
        return;
    }
    res.json({ "err":"id not set /rest/create_new_ovpn_client/:id or is empty"  });
});


app.get('/rest/revoke_ovpn_client/:id', function (req, res) {
    var id = req.params.id;
    id = sanitizer.sanitize(id);
    console.log(id);
    if (id != null || String(id).length > 0) {
        var result = shell.exec('pivpn -r ' + String(id) + ' ');
        console.log(result);

        res.json({ "res": result });
        return;
    }
    res.json({ "err": "id not set /rest/revoke_ovpn_client/:id or is empty" });
});



app.get('/rest/download_ovpn_config/:id', function (req, res) {
    var id = req.params.id;
    id = sanitizer.sanitize(id);
    if (id == null || String(id).length <= 0) {
        return res.status(404).send("id len <= 0 or not set");
    }

    var new_remote_ip = String(config.pivpn_remote_tunnel_server_ip);
    var config_ovpn_file = String(id);

    fs.readFile(config.pivpn_ovpns_dir + "/" + String(config_ovpn_file) + ".ovpn", 'utf8', function (err, contents) {
        if (err) {
            console.log(err);
            res.status(404).send(err);
        }
        var lines = eol.split(contents);
        var modified_config_file = "";
        //GOTO EACH LINE
        for (var i = 0; i < lines.length; i++) {
            //REPLACE THE remote host port LINE 
            var re = /remote [\S]+ [\d]+/i;
            var found = lines[i].match(re);
            if (found != null && found.length > 0) {
                console.log(found[0]);
                console.log("--- REPL --");
                modified_config_file = contents.replace(String(found[0]), "remote " + String(config.pivpn_remote_server_hostname) + " " + String(config.pivpn_ovpn_remote_tunnel_port));
                break;
            }
        }


        fs.writeFile(config.pivpn_ovpns_dir + "/" + String(config_ovpn_file) + "_modified.ovpn", modified_config_file, function (err) {
            if (err) {
                return res.status(404).send(err);
            }

            res.setHeader("Content-Type", "application/x-openvpn-profile");
            res.setHeader("Content-Dispositon", "attachment; filename=" + String(config_ovpn_file) + ".ovpn");
            res.sendFile(config.pivpn_ovpns_dir + "/" + String(config_ovpn_file) + "_modified.ovpn");
        });
    });
});


//---------------- SOCKET IO START ------------- //

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('msg', function (msg) {
        console.log(msg);
    });
});





//BROADCAST  socket.broadcast.emit('update', {});
function get_active_client_status(){
    
    var result = shell.exec('pivpn -c');

    var cl = [];
    var lines = eol.split(result.stdout);
    var list_begin = false;
    for(var i = 0;i < lines.length;i++){
        if (String(lines[i]).includes('Client Status List')){
            list_begin = true;
            i++; //SKIP NEXT LINE
            continue;
        }

        if (String(lines[i]).includes('No Clients Connected!')){
            cl = [];
            break;
        }
        if (list_begin){
            if (lines[i] == ""){
                continue;
            }
            cl.push({ "data": lines[i]});
        }
    }
//    console.log(lines);
 //   console.log(cl);
   // console.log("CLIENTS ACTIVE :" + String(cl.length));

    return cl;
}

get_active_client_status();

//CRON JOB EVER MINUTE
cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
    if (autossh_tunnel_instance == null && config.activate_ssh_tunnel){
        open_ssh_tunnel();
    }

    get_active_client_status();
});






















//---------------------- FOR REST ENDPOINT LISTING ---------------------------------- //
app.get('/rest', function (req, res) {
    res.redirect('/restexplorer.html');
});

//RETURNS A JSON WITH ONLY /rest ENPOINTS TO GENERATE A NICE HTML SITE
var REST_ENDPOINT_PATH_BEGIN_REGEX = "^\/rest\/(.)*$"; //REGEX FOR ALL /rest/* beginning
var REST_API_TITLE = config.app_name | "APP NAME HERE";
var rest_endpoint_regex = new RegExp(REST_ENDPOINT_PATH_BEGIN_REGEX);
var REST_PARAM_REGEX = "\/:(.*)\/"; // FINDS /:id/ /:hallo/test
//HERE YOU CAN ADD ADDITIONAL CALL DESCTIPRION
var REST_ENDPOINTS_DESCRIPTIONS = [
    { endpoints: "/rest/update/:id", text: "UPDATE A VALUES WITH ID" }

];

app.get('/listendpoints', function (req, res) {
    var ep = listEndpoints(app);
    var tmp = [];
    for (let index = 0; index < ep.length; index++) {
        var element = ep[index];
        if (rest_endpoint_regex.test(element.path)) {
            //LOAD OPTIONAL DESCRIPTION
            for (let descindex = 0; descindex < REST_ENDPOINTS_DESCRIPTIONS.length; descindex++) {
                if (REST_ENDPOINTS_DESCRIPTIONS[descindex].endpoints == element.path) {
                    element.desc = REST_ENDPOINTS_DESCRIPTIONS[descindex].text;
                }
            }
            //SEARCH FOR PARAMETERS
            //ONLY REST URL PARAMETERS /:id/ CAN BE PARSED
            //DO A REGEX TO THE FIRST:PARAMETER
            element.url_parameters = [];
            var arr = (String(element.path) + "/").match(REST_PARAM_REGEX);
            if (arr != null) {
                //SPLIT REST BY /
                var splittedParams = String(arr[0]).split("/");
                var cleanedParams = [];
                //CLEAN PARAEMETER BY LOOKING FOR A : -> THAT IS A PARAMETER
                for (let cpIndex = 0; cpIndex < splittedParams.length; cpIndex++) {
                    if (splittedParams[cpIndex].startsWith(':')) {
                        cleanedParams.push(splittedParams[cpIndex].replace(":", "")); //REMOVE :
                    }
                }
                //ADD CLEANED PARAMES TO THE FINAL JOSN OUTPUT
                for (let finalCPIndex = 0; finalCPIndex < cleanedParams.length; finalCPIndex++) {
                    element.url_parameters.push({ name: cleanedParams[finalCPIndex] });

                }
            }
            //ADD ENPOINT SET TO FINAL OUTPUT
            tmp.push(element);
        }
    }
    res.json({ api_name: REST_API_TITLE, endpoints: tmp });
});
