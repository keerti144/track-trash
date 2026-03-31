import torch
import torch.nn as nn
import torchvision
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import os

# Transform
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])

# Load dataset
dataset = datasets.ImageFolder("dataset/", transform=transform)
loader = DataLoader(dataset, batch_size=32, shuffle=True)

# Model
from torchvision.models import MobileNet_V2_Weights
model = torchvision.models.mobilenet_v2(weights=MobileNet_V2_Weights.DEFAULT)
model.classifier[1] = nn.Linear(model.last_channel, 6)

# Loss + optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Train
for epoch in range(5):
    for images, labels in loader:
        outputs = model(images)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    print(f"Epoch {epoch+1}, Loss: {loss.item()}")

os.makedirs("model", exist_ok=True)  # create folder if not exists
torch.save(model.state_dict(), "model/saved_model.pth")