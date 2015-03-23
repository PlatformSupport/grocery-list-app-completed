(function () {
    var apiKey = "YOUR_API_KEY";
    var scheme = 'https';

    var el = new Everlive({
        apiKey: apiKey,
        scheme: scheme
    });

    window.loginView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }

            el.Users.login(this.username, this.password,
                function (data) {
                    window.location.href = "#list";

                    initListView();
                },
                function () {
                    navigator.notification.alert("Unfortunately we could not find your account.");
                });
        }
    });

    window.registerView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Username is required.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Password is required.");
                return;
            }
            el.Users.register(this.username, this.password, {
                    Email: this.email
                },
                function () {
                    navigator.notification.alert("Your account was successfully created.");
                    window.location.href = "#login";
                },
                function () {
                    navigator.notification.alert("Unfortunately we were unable to create your account.");
                });
        }
    });

    window.passwordView = kendo.observable({
        submit: function () {
            if (!this.email) {
                navigator.notification.alert("Email address is required.");
                return;
            }
            $.ajax({
                type: "POST",
                url: "https://api.everlive.com/v1/" + apiKey + "/Users/resetpassword",
                contentType: "application/json",
                data: JSON.stringify({
                    Email: this.email
                }),
                success: function () {
                    navigator.notification.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                    window.location.href = "#login";
                },
                error: function () {
                    navigator.notification.alert("Unfortunately, an error occurred resetting your password.")
                }
            });
        }
    });
    // TODO - add a view about this
   

    window.listView = kendo.observable({
        grocery: "",
        add: function () {
            if (this.grocery.trim() === "") {
                navigator.notification.alert("Please provide a grocery.");
                return;
            }

            groceryDataSource.add({
                Name: this.grocery
            });
            groceryDataSource.one("sync", this.close());
            groceryDataSource.sync();
            this.set("grocery", "");
        },
        close: function () {
            $("#add").data("kendoMobileModalView").close();
        },
        logout: function (event) {
            // Prevent going to the login page until the login call processes.
            event.preventDefault();
            el.Users.logout(function () {
                this.loginView.set("username", "");
                this.loginView.set("password", "");
                window.location.href = "#login";
            }, function () {
                navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
            });
        }
    });

    var groceryDataSource = new kendo.data.DataSource({
        type: "everlive",
        transport: {
            typeName: "Groceries"
        }
    });

    function initListView() {
        $("#grocery-list").kendoMobileListView({
            dataSource: groceryDataSource,
            template: "#: Name #"
        });
    };

    function initialize() {
        var app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });

        navigator.splashscreen.hide();
     //   initListView();
    }

    document.addEventListener("deviceready", initialize);
}());
