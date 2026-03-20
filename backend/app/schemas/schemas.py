from marshmallow import Schema, fields, validate

class LoginRequestSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class RegisterRequestSchema(Schema):
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class AttemptRequestSchema(Schema):
    digits = fields.List(fields.Int(validate=validate.Range(min=1, max=6)), required=True, validate=lambda x: len(x) == 4)
