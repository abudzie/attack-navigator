import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Technique, Tactic, Mitigation } from '../../../data.service';
import { ViewModel, TechniqueVM } from '../../../viewmodels.service';
import { ConfigService, ContextMenuItem } from '../../../config.service';
import { CellPopover } from '../cell-popover';



@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.scss']
})
export class ContextmenuComponent extends CellPopover implements OnInit {
    @Input() technique: Technique;
    @Input() tactic: Tactic;
    @Input() viewModel: ViewModel;
    public placement: string;
    @Output() close = new EventEmitter<any>();
    public value: number;
    
 



    public checkBox(event): any
    {     

        this.viewModel.clearSelectedTechniques()
        this.viewModel.selectTechnique(this.technique, this.tactic)
        var store = this.viewModel.map.get(this.technique.attackID)
        if (event.checked)
        {
            store++
            this.viewModel.map.set(this.technique.attackID, store)      
            this.viewModel.count++;

        }
         
        else{
            store--
            this.viewModel.map.set(this.technique.attackID, store)
            this.viewModel.count--;
            
        }


        switch(true)
        {

            case(this.viewModel.count >= 0 && this.viewModel.count < 24):
            {
                this.viewModel.level = "HIGH-THREAT.\n Score: " + this.viewModel.count * 0.493 + "%" ; 
                break;
            }

            case(this.viewModel.count >= 25 && this.viewModel.count < 48):
            {
                this.viewModel.level = "MID-THREAT.\n Score: " + this.viewModel.count * 0.493 + "%" ;
                break;
            }

            case(this.viewModel.count >= 49 && this.viewModel.count <= 96):
            {
                this.viewModel.level = "LOW-THREAT. \n Score: " + this.viewModel.count * 0.493 + "%" ;
                break;
            }
           
            default:
            break;
          
        }


        switch(this.viewModel.map.get(this.technique.attackID))
        {
            case 0:
                console.log(this.technique.attackID + " is " + 0)
                this.viewModel.editSelectedTechniques('color', '#FF4D4D')
                break;
            case 1:
                console.log(this.technique.attackID + " is " + 1)      


                if (this.viewModel.mitigations[this.technique.attackID].length == 1)
                {
                    this.viewModel.editSelectedTechniques('color', '#00FF00')  
                }
                else{
                    this.viewModel.editSelectedTechniques('color', '#FF8400')      
                }

                break;
             case 2:
                console.log(this.technique.attackID + " is " + 2)
                if (this.viewModel.mitigations[this.technique.attackID].length == 2)
                {
                    this.viewModel.editSelectedTechniques('color', '#00FF00') 
                }

                else
                {
                    this.viewModel.editSelectedTechniques('color', '#FFFF00')   
                }                
                break;

                case 3:
                    console.log(this.technique.attackID + " is " + 3)
                    this.viewModel.editSelectedTechniques('color', '#00FF00')   
                    break;

            default:
                break;


        }


    }

    private get techniqueVM(): TechniqueVM {
        return this.viewModel.getTechniqueVM(this.technique, this.tactic);
    }

    constructor(private element: ElementRef, public configService: ConfigService) {
        super(element);
    
        
    }

    ngOnInit() {
        this.placement = this.getPosition();      
       
    }

    public closeContextmenu() {
        this.close.emit();
        this.viewModel.clearSelectedTechniques()
    }

    public select() {
        this.viewModel.clearSelectedTechniques();
        this.viewModel.selectTechnique(this.technique, this.tactic);
        this.closeContextmenu();
    }

    public addSelection() {
        this.viewModel.selectTechnique(this.technique, this.tactic);
        this.closeContextmenu();
    }

    public removeSelection() {
        this.viewModel.unselectTechnique(this.technique, this.tactic);
        this.closeContextmenu();
    }

    public selectAll() {
        this.viewModel.selectAllTechniques();
        this.closeContextmenu();
    }

    public deselectAll() {
        this.viewModel.clearSelectedTechniques();
        this.closeContextmenu();
    }

    public invertSelection() {
        this.viewModel.invertSelection();
        this.closeContextmenu();
    }

    public selectAnnotated() {
        this.viewModel.selectAnnotated();
        this.closeContextmenu();
    }

    public selectUnannotated() {
        this.viewModel.selectUnannotated();
        this.closeContextmenu();
    }

    public selectAllInTactic(){
        this.viewModel.selectAllTechniquesInTactic(this.tactic);
        this.closeContextmenu();
    }

    public deselectAllInTactic(){
        this.viewModel.unselectAllTechniquesInTactic(this.tactic);
        this.closeContextmenu();
    }

    public viewTechnique() {
        window.open(this.technique.url, "_blank");
        this.closeContextmenu();
    }

    public viewTactic() {
        window.open(this.tactic.url, "_blank");
        this.closeContextmenu();
    }

    public openCustomContextMenuItem(customItem: ContextMenuItem) {
        
        window.open(customItem.getReplacedURL(this.technique, this.tactic), "_blank");
        this.closeContextmenu();
        
    }
}
