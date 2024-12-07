from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from fpdf import FPDF
from flask import send_file
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))

@app.route('/customers')
def customers():
    return render_template('customers.html')

@app.route('/api/customers', methods=['GET', 'POST'])
def manage_customers():
    if request.method == 'POST':
        data = request.json
        new_customer = Customer(**data)
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({'message': 'Customer added!'}), 201
    customers = Customer.query.all()
    return jsonify([{'id': c.id, 'name': c.name, 'email': c.email, 'phone': c.phone, 'address': c.address} for c in customers])

@app.route('/api/customers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def customer_detail(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({'message': 'Customer not found'}), 404

    if request.method == 'GET':
        return jsonify({'id': customer.id, 'name': customer.name, 'email': customer.email, 'phone': customer.phone, 'address': customer.address})

    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(customer, key, value)
        db.session.commit()
        return jsonify({'message': 'Customer updated!'})

    if request.method == 'DELETE':
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted!'})
    






class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(200))
    price = db.Column(db.Float)
    unit = db.Column(db.String(50))

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/api/products', methods=['GET', 'POST'])
def manage_products():
    if request.method == 'POST':
        data = request.json
        new_product = Product(**data)
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'message': 'Product added!'}), 201
    products = Product.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price, 'unit': p.unit} for p in products])

@app.route('/api/products/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def product_detail(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({'message': 'Product not found'}), 404

    if request.method == 'GET':
        return jsonify({'id': product.id, 'name': product.name, 'description': product.description, 'price': product.price, 'unit': product.unit})

    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(product, key, value)
        db.session.commit()
        return jsonify({'message': 'Product updated!'})

    if request.method == 'DELETE':
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted!'})
    

@app.route('/print-view')
def print_view():
    return render_template('print_view.html')





@app.route('/quotations')
def quotations():
    return render_template('quotations.html')








class Quotation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100))
    total_products = db.Column(db.Integer)
    total_amount = db.Column(db.Float)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pending')  # pending/completed

@app.route('/api/quotations', methods=['GET'])
def get_quotations():
    quotations = Quotation.query.all()
    return jsonify([
        {
            'id': q.id,
            'customer_name': q.customer_name,
            'total_products': q.total_products,
            'total_amount': q.total_amount,
            'date_created': q.date_created.strftime("%Y-%m-%d %H:%M:%S"),
            'status': q.status
        } for q in quotations
    ])

@app.route('/api/quotations/<int:id>', methods=['PUT', 'DELETE'])
def manage_quotation(id):
    quotation = Quotation.query.get(id)
    if not quotation:
        return jsonify({'message': 'Quotation not found'}), 404

    if request.method == 'PUT':
        data = request.json
        quotation.status = data.get('status', quotation.status)
        db.session.commit()
        return jsonify({'message': 'Quotation updated!'})

    if request.method == 'DELETE':
        db.session.delete(quotation)
        db.session.commit()
        return jsonify({'message': 'Quotation deleted!'})
    


@app.route('/')
def dashboard():
    return render_template('dashboard.html')




@app.route('/api/quotations', methods=['POST'])
def save_quotation():
    data = request.json
    new_quotation = Quotation(
        customer_name=data['customer_name'],
        total_products=data['total_products'],
        total_amount=data['total_amount'],
        date_created=datetime.utcnow(),
        status='pending'
    )
    db.session.add(new_quotation)
    db.session.commit()
    return jsonify({'message': 'Quotation saved!'}), 201




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
