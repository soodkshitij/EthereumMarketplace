from flask import Flask, render_template, request
import uuid
import os
import cloudinaryservice
import json

app = Flask(__name__)


@app.route("/")
def getHome():
    return render_template("index.html")

@app.route("/login")
def getLogin():
    return render_template("login.html")

@app.route("/sell")
def sell():
    return render_template("sell.html")

@app.route("/buy")
def buy():
    return render_template("buy.html")

@app.route("/product")
def product():
    return render_template("product.html")

@app.route('/upload-file',methods=['POST'])
def post_file():
    print("inside post")
    name = uuid.uuid4().hex
    file = request.files['upl']
    file.save(os.path.join("/tmp/", name))
    res = cloudinaryservice.upload(os.path.join("/tmp/", name))
    s = os.path.getsize(os.path.join("/tmp/", name))
    return json.dumps({'files':[{'public_id':res['public_id'],'size':s,'name':file.filename}]})

@app.route("/transactions",methods=['GET'])
def getTransactions():
    return render_template("transactions.html")

@app.route("/my-account",methods=['GET'])
def account():
    return render_template("account.html")


if __name__ == '__main__':
    app.run(port=3002, debug=True)