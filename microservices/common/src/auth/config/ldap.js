var auth = require('basic-auth');
const { authenticate } = require('ldap-authentication');

module.exports.authenticateUser = async function authenticateUser(req) {
  try {
    var credentials = auth(req);

    var opts = {
      ldapOpts: {
        url: 'ldap://ds.cisco.com:389'
      },
      userSearchBase: 'OU=Employees,OU=Cisco Users,DC=cisco,DC=com',
      usernameAttribute: 'cn',
      username: credentials.name,
      userDn: `CN=${credentials.name},OU=Employees,OU=Cisco Users,DC=cisco,DC=com`,
      userPassword: credentials.pass
    };

    return await authenticate(opts);
  } catch (e) {
    console.log("Failed to Authenticate with LDAP server", e);
    return;
  }
}
